describe("Registration Page E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("should display the registration form elements correctly", () => {
    cy.contains("h2", "Create Account").should("be.visible");
    cy.get('input[placeholder="First Name"]').should("be.visible");
    cy.get('input[placeholder="Last Name"]').should("be.visible");
    cy.get('input[placeholder="Email Address"]').should("be.visible");
    cy.get('input[placeholder="Password"]').should("be.visible");
    cy.get('input[placeholder="Confirm"]').should("be.visible");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("contain", "Register Now");
    cy.contains("a", "Login").should("have.attr", "href", "/login");
  });

  it("should show error when passwords do not match", () => {
    cy.get('input[placeholder="First Name"]').type("John");
    cy.get('input[placeholder="Last Name"]').type("Doe");
    cy.get('input[placeholder="Email Address"]').type("john@example.com");
    cy.get('input[placeholder="Password"]').type("password123");
    cy.get('input[placeholder="Confirm"]').type("different123");

    cy.get('button[type="submit"]').click();
    cy.contains("Passwords do not match!").should("be.visible");
  });

  it("should show error toast on registration API failure", () => {
    cy.intercept("POST", "http://localhost:3000/users/register", {
      statusCode: 400,
      body: { message: "Email already exists" },
    }).as("registerFail");

    cy.get('input[placeholder="First Name"]').type("John");
    cy.get('input[placeholder="Last Name"]').type("Doe");
    cy.get('input[placeholder="Email Address"]').type("existing@example.com");
    cy.get('input[placeholder="Password"]').type("password123");
    cy.get('input[placeholder="Confirm"]').type("password123");

    cy.get('button[type="submit"]').click();

    cy.wait("@registerFail");
    cy.contains("Registration failed. Please try again.").should("be.visible");
  });

  it("should register successfully and redirect to login page", () => {
    cy.intercept("POST", "http://localhost:3000/users/register", {
      statusCode: 201,
      body: { message: "User registered successfully" },
    }).as("registerSuccess");

    cy.get('input[placeholder="First Name"]').type("Jane");
    cy.get('input[placeholder="Last Name"]').type("Smith");
    cy.get('input[placeholder="Email Address"]').type("jane@example.com");
    cy.get('input[placeholder="Password"]').type("securepass123");
    cy.get('input[placeholder="Confirm"]').type("securepass123");

    cy.get('button[type="submit"]').click();

    cy.wait("@registerSuccess");
    cy.contains("Registration successful! Redirecting to login...").should(
      "be.visible"
    );

    // Verify redirect to login page after delay
    cy.url({ timeout: 4000 }).should("include", "/login");
  });

  it("should navigate to login page when clicking 'Login' link", () => {
    cy.contains("a", "Login").click();
    cy.url().should("include", "/login");
  });
});
