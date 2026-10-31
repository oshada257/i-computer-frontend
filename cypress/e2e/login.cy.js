describe("Login Page E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should display the login form elements correctly", () => {
    cy.contains("h2", "Welcome Back").should("be.visible");
    cy.contains("p", "Please enter your details").should("be.visible");
    cy.get('input[type="email"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "email@example.com");
    cy.get('input[type="password"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "••••••••");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("contain", "Sign In");
    cy.contains("a", "Register here").should("have.attr", "href", "/register");
  });

  it("should show validation error when email or password is empty", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Please enter both email and password").should("be.visible");
  });

  it("should show error toast on invalid credentials", () => {
    cy.intercept("POST", "http://localhost:3000/users/login", {
      statusCode: 401,
      body: { message: "Invalid credentials" },
    }).as("loginFailed");

    cy.get('input[type="email"]').type("invalid@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginFailed");
    cy.contains("Invalid credentials").should("be.visible");
  });

  it("should show server connection error toast on network error", () => {
    cy.intercept("POST", "http://localhost:3000/users/login", {
      forceNetworkError: true,
    }).as("networkError");

    cy.get('input[type="email"]').type("user@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.contains(
      "Cannot reach the server. Please check if the API is running.",
    ).should("be.visible");
  });

  it("should successfully log in a regular user and redirect to home page", () => {
    const mockUser = {
      id: "user-123",
      email: "user@example.com",
      role: "user",
    };

    cy.intercept("POST", "http://localhost:3000/users/login", {
      statusCode: 200,
      body: {
        token: "mock-jwt-token-12345",
        user: mockUser,
      },
    }).as("loginSuccess");

    cy.get('input[type="email"]').type("user@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginSuccess");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.eq("mock-jwt-token-12345");
      expect(JSON.parse(win.localStorage.getItem("user"))).to.deep.eq(mockUser);
    });

    cy.contains("Login successful!").should("be.visible");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("should successfully log in an admin user and redirect to admin panel", () => {
    const mockAdmin = {
      id: "admin-456",
      email: "admin@example.com",
      role: "admin",
    };

    cy.intercept("POST", "http://localhost:3000/users/login", {
      statusCode: 200,
      body: {
        token: "mock-admin-jwt-67890",
        user: mockAdmin,
      },
    }).as("adminLoginSuccess");

    cy.get('input[type="email"]').type("admin@example.com");
    cy.get('input[type="password"]').type("admin123");
    cy.get('button[type="submit"]').click();

    cy.wait("@adminLoginSuccess");
    cy.contains("Login successful!").should("be.visible");
    cy.url().should("include", "/admin");
  });

  it("should prevent non-registered user from logging in and display user not registered toast", () => {
    cy.intercept("POST", "http://localhost:3000/users/login", {
      statusCode: 404,
      body: { message: "User not registered. Please create an account first." },
    }).as("userNotFound");

    cy.get('input[type="email"]').type("notregistered@example.com");
    cy.get('input[type="password"]').type("somepassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@userNotFound");
    cy.contains("User not registered. Please create an account first.").should(
      "be.visible"
    );
  });

  it("should navigate to registration page when clicking 'Register here'", () => {
    cy.contains("a", "Register here").click();
    cy.url().should("include", "/register");
  });
});
