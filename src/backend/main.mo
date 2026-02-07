import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Char "mo:core/Char";
import Blob "mo:core/Blob";
import Random "mo:core/Random";

actor {
  // Blob storage for images
  include MixinStorage();

  // Access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  module ProductCategory {
    public type ProductCategory = {
      #food;
      #grocery;
    };

    public func toText(category : ProductCategory) : Text {
      switch (category) {
        case (#food) { "Food" };
        case (#grocery) { "Grocery" };
      };
    };
  };

  public type ProductCategory = ProductCategory.ProductCategory;

  let products = Map.empty<Text, Product>();

  module Product {
    public type Product = {
      id : Text;
      name : Text;
      price : Nat;
      category : ProductCategory;
      image : Storage.ExternalBlob;
      createdAt : Int;
      updatedAt : Int;
    };

    public func compare(a : Product, b : Product) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  public type Product = Product.Product;

  func currentTime() : Int {
    Time.now();
  };

  func createProductInternal(name : Text, price : Nat, category : ProductCategory, image : Storage.ExternalBlob) : Product {
    {
      id = name;
      name;
      price;
      category;
      image;
      createdAt = currentTime();
      updatedAt = currentTime();
    };
  };

  public type ProductInput = {
    name : Text;
    price : Nat;
    category : ProductCategory;
    image : Storage.ExternalBlob;
  };

  public type ProductSummary = {
    id : Text;
    name : Text;
    price : Nat;
    category : ProductCategory;
    image : Storage.ExternalBlob;
  };

  public query ({ caller }) func getAllProducts() : async [ProductSummary] {
    products.values().map(
      func(p) {
        {
          id = p.id;
          name = p.name;
          price = p.price;
          category = p.category;
          image = p.image;
        };
      }
    ).toArray();
  };

  public query ({ caller }) func getFoodProducts() : async [ProductSummary] {
    products.values().filter(
      func(p) { p.category == #food }
    ).map(
      func(p) {
        {
          id = p.id;
          name = p.name;
          price = p.price;
          category = p.category;
          image = p.image;
        };
      }
    ).toArray();
  };

  public query ({ caller }) func getGroceryProducts() : async [ProductSummary] {
    products.values().filter(
      func(p) { p.category == #grocery }
    ).map(
      func(p) {
        {
          id = p.id;
          name = p.name;
          price = p.price;
          category = p.category;
          image = p.image;
        };
      }
    ).toArray();
  };

  public query ({ caller }) func getProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getProductImage(id : Text) : async Storage.ExternalBlob {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product.image };
    };
  };

  func generateSessionToken() : async Text {
    let entropy = await Random.blob();
    let timeNanos = Int.abs(Time.now());

    let combined = entropy.toArray().concat(Blob.fromArray(natToBytes(timeNanos)).toArray());
    bytesToHex(combined);
  };

  func natToBytes(n : Nat) : [Nat8] {
    if (n == 0) { return [0] };
    var num = n;
    var bytes : [Nat8] = [];
    while (num > 0) {
      bytes := [Nat8.fromNat(num % 256)].concat(bytes);
      num := num / 256;
    };
    bytes;
  };

  func bytesToHex(bytes : [Nat8]) : Text {
    let hexChars = "0123456789abcdef".toArray();
    var result = "";
    for (byte in bytes.vals()) {
      let high = Nat8.toNat(byte / 16);
      let low = Nat8.toNat(byte % 16);
      result := result # hexChars[high].toText() # hexChars[low].toText();
    };
    result;
  };

  let adminSessions = Map.empty<Text, Bool>();

  func isValidAdminCredentials(username : Text, password : Text) : Bool {
    let trimmedUsername = username.trim(#char(' '));
    let trimmedPassword = password.trim(#char(' '));
    trimmedUsername == "9897743469" and trimmedPassword == "rk3469sa";
  };

  public shared ({ caller }) func loginAdmin(username : Text, password : Text) : async Text {
    if (isValidAdminCredentials(username, password)) {
      let token = await generateSessionToken();
      adminSessions.add(token, true);
      token;
    } else {
      Runtime.trap("Invalid credentials");
    };
  };

  public query ({ caller }) func isAdminSession(token : Text) : async Bool {
    switch (adminSessions.get(token)) {
      case (null) { false };
      case (?isValid) { isValid };
    };
  };

  public shared ({ caller }) func createProduct(token : Text, input : ProductInput) : async ProductSummary {
    switch (adminSessions.get(token)) {
      case (?true) {
        let newProduct = createProductInternal(input.name, input.price, input.category, input.image);
        products.add(newProduct.id, newProduct);
        {
          id = newProduct.id;
          name = newProduct.name;
          price = newProduct.price;
          category = newProduct.category;
          image = newProduct.image;
        };
      };
      case (_) { Runtime.trap("Unauthorized: Only admins can create products") };
    };
  };

  public shared ({ caller }) func updateProduct(token : Text, id : Text, input : ProductInput) : async ProductSummary {
    switch (adminSessions.get(token)) {
      case (?true) {
        switch (products.get(id)) {
          case (null) { Runtime.trap("Product not found") };
          case (?existingProduct) {
            let updatedProduct = {
              existingProduct with
              name = input.name;
              price = input.price;
              category = input.category;
              image = input.image;
              updatedAt = currentTime();
            };
            products.add(id, updatedProduct);
            {
              id = updatedProduct.id;
              name = updatedProduct.name;
              price = updatedProduct.price;
              category = updatedProduct.category;
              image = updatedProduct.image;
            };
          };
        };
      };
      case (_) { Runtime.trap("Unauthorized: Only admins can update products") };
    };
  };

  public shared ({ caller }) func deleteProduct(token : Text, id : Text) : async () {
    switch (adminSessions.get(token)) {
      case (?true) {
        if (not products.containsKey(id)) {
          Runtime.trap("Product does not exist");
        };
        products.remove(id);
      };
      case (_) { Runtime.trap("Unauthorized: Only admins can delete products") };
    };
  };
};
