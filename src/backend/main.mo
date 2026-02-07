import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat32 "mo:core/Nat32";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
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

  let products = Map.empty<Text, Product>();

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

  // Admin-only: Create Product
  public shared ({ caller }) func createProduct(name : Text, price : Nat, category : ProductCategory, image : Storage.ExternalBlob) : async Product {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let newProduct = createProductInternal(name, price, category, image);
    products.add(newProduct.id, newProduct);
    newProduct;
  };

  // Admin-only: Update Product
  public shared ({ caller }) func updateProduct(id : Text, name : Text, price : Nat, category : ProductCategory, image : Storage.ExternalBlob) : async Product {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let updatedProduct = {
          existingProduct with
          name;
          price;
          category;
          image;
          updatedAt = currentTime();
        };
        products.add(id, updatedProduct);
        updatedProduct;
      };
    };
  };

  // Admin-only: Delete Product
  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product does not exist");
    };
    products.remove(id);
  };

  func filterByCategory(category : ProductCategory) : Iter.Iter<Product> {
    products.values().filter(func(p) { p.category == category });
  };

  // Public read access - no authorization needed
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Public read access - no authorization needed
  public query ({ caller }) func getFoodProducts() : async [Product] {
    filterByCategory(#food).toArray().sort();
  };

  // Public read access - no authorization needed
  public query ({ caller }) func getGroceryProducts() : async [Product] {
    filterByCategory(#grocery).toArray().sort();
  };

  // Public read access - no authorization needed
  public query ({ caller }) func getProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Public read access - no authorization needed
  public query ({ caller }) func getProductImage(id : Text) : async Storage.ExternalBlob {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product.image };
    };
  };
};
