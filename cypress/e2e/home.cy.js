describe("Home Page E2E Tests", () => {
  const mockProducts = [
    {
      _id: "p1",
      productId: "PROD001",
      name: "Gaming Laptop Pro",
      description: "High performance gaming laptop",
      price: 1200,
      labelledPrice: 1500,
      category: "laptops",
      brand: "Asus",
      image: "/images/laptop.png",
    },
    {
      _id: "p2",
      productId: "PROD002",
      name: "Wireless Mouse",
      description: "Ergonomic optical mouse",
      price: 30,
      labelledPrice: 45,
      category: "mouse",
      brand: "Logitech",
      image: "/images/mouse.png",
    },
  ];

  beforeEach(() => {
    cy.intercept("GET", "**/products", {
      statusCode: 200,
      body: mockProducts,
    }).as("getProducts");
  });

  it("should display store branding and hero banner correctly", () => {
    cy.visit("/");
    cy.wait("@getProducts");

    cy.contains("h1", "E-Computer").should("be.visible");
    cy.contains("h2", "Welcome to E-Computer").should("be.visible");
    cy.contains("button", "SHOP NOW").should("be.visible");
  });

  it("should display fetched products on the home page", () => {
    cy.visit("/");
    cy.wait("@getProducts");

    cy.contains("Gaming Laptop Pro").should("be.visible");
    cy.contains("Wireless Mouse").should("be.visible");
  });

  it("should filter products using search input", () => {
    cy.visit("/");
    cy.wait("@getProducts");

    cy.get('input[placeholder="Search products..."]').type("Laptop");
    cy.contains("Gaming Laptop Pro").should("be.visible");
    cy.contains("Wireless Mouse").should("not.exist");
  });

  it("should show prompt to login when unauthenticated user clicks Buy Now", () => {
    cy.visit("/");
    cy.wait("@getProducts");

    // Clear any existing auth state
    cy.clearLocalStorage();

    cy.contains("button", "Buy Now").first().click();
    cy.contains("Please login to purchase products").should("be.visible");
    cy.url({ timeout: 3000 }).should("include", "/login");
  });

  it("should display user profile header and support logout when authenticated", () => {
    const mockUser = { firstName: "Alice", role: "user" };
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", "mock-token-xyz");

    cy.visit("/");
    cy.wait("@getProducts");

    cy.contains("Welcome, Alice").should("be.visible");
    cy.contains("button", "Logout").click();

    cy.url().should("include", "/login");
    cy.then(() => {
      expect(localStorage.getItem("token")).to.be.null;
      expect(localStorage.getItem("user")).to.be.null;
    });
  });
});
