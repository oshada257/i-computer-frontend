describe("Cart Page E2E Tests", () => {
  it("should redirect unauthenticated user to login page", () => {
    cy.clearLocalStorage();
    cy.visit("/cart");
    cy.url().should("include", "/login");
  });

  it("should display empty cart message when cart has no items", () => {
    const mockUser = { firstName: "Bob", role: "user" };
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", "token-123");

    cy.visit("/cart");
    cy.contains("Shopping Cart").should("be.visible");
    cy.contains("Your cart is empty").should("be.visible");
    cy.contains("Add some products to your cart to get started!").should(
      "be.visible"
    );
    cy.contains("button", "Start Shopping").should("be.visible");
  });

  it("should navigate to home page when clicking 'Start Shopping'", () => {
    const mockUser = { firstName: "Bob", role: "user" };
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", "token-123");

    cy.visit("/cart");
    cy.contains("button", "Start Shopping").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });
});
