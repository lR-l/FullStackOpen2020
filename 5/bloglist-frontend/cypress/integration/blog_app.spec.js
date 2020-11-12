const userMain = {
  name: "Main user",
  username: "Mai",
  password: "4dm!n",
};

const userOther = {
  name: "Other user",
  username: "Oui",
  password: "#12345!",
};

const blog = {
  title: "Testing for dummies",
  author: "Master JS",
  url: "http://localhost",
};

const blogR1 = {
  title: "Programming with React vol.1",
  author: "Master JS",
  url: "http://localhost",
};

const blogR2 = {
  title: "Programming with React vol.2",
  author: "Master JS",
  url: "http://localhost",
};

const blogR3 = {
  title: "Programming with React vol.3",
  author: "Master JS",
  url: "http://localhost",
};

describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.request("POST", "http://localhost:3003/api/users", userMain);
    cy.clearLocalStorage("userToken");
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
    cy.contains("Username:");
    cy.contains("Password:");
    cy.get("input#loginUsername");
    cy.get("input#loginPassword");
    cy.get("button").contains("Login");
  });

  describe("Login", function () {
    it("Login success with correct credentials", function () {
      cy.get("input#loginUsername").type(userMain.username);
      cy.get("input#loginPassword").type(userMain.password);
      cy.get("button").contains("Login").click();
      cy.get("html")
        .should("contain", `${userMain.name} logged in`)
        .should(function () {
          expect(localStorage.getItem("userToken")).to.not.be.null;
        });
    });

    it("Login failed with incorrect credentials", function () {
      cy.get("input#loginUsername").type("Höpö");
      cy.get("input#loginPassword").type("123456");
      cy.get("#loginButton").click();
      cy.get(".errorMessage")
        .should("contain", "Wrong credentails")
        .and("have.css", "background-image", "linear-gradient(90deg, rgb(122, 0, 0) 0%, rgb(186, 45, 45) 46%, rgb(255, 0, 0) 100%)");
      cy.get("html")
        .should("not.contain", `${userMain.name} logged in`)
        .should(function () {
          expect(localStorage.getItem("userToken")).to.be.null;
        });
    });
  });

  describe("Logged in", function () {
    beforeEach(function () {
      cy.login(userMain.username, userMain.password);
    });

    it("A blog can be created", function () {
      cy.get("button.togglableShowButton").contains("Create new form").click();
      cy.get("#title").type(blog.title);
      cy.get("#author").type(blog.author);
      cy.get("#url").type(blog.url);
      cy.get("button[type=submit]").contains("Ok").click();
      cy.get(".infoMessage").should("contain", `Blog created successfully! (${blog.title})`);
      cy.get("span").should("contain", `${blog.title} ${blog.author}`);
    });

    describe("Blog created", function () {
      beforeEach(function () {
        cy.createBlog(blog);
      });

      it("A blog can be liked", function () {
        cy.get("span").should("contain", `${blog.title} ${blog.author}`).parent().find("button").contains("Show").click();
        cy.get("span").contains("Likes: 0");
        cy.get("button").contains("Like 👍").click();
        cy.get(".infoMessage").should("contain", `Updated "${blog.title}" likes`);
        cy.get("span").contains("Likes: 1");
      });

      it("A blog can be deleted", function () {
        cy.get("span").should("contain", `${blog.title} ${blog.author}`).parent().find("button").contains("Show").click();
        cy.get("button").contains("Delete").click();
        cy.get(".infoMessage").should("contain", `Deleted blog "${blog.title}"`);
        cy.get("span").should("not.contain", `${blog.title} ${blog.author}`);
      });

      it("A blog can't be deleted if owner is not currently logged user", function () {
        cy.request("POST", "http://localhost:3003/api/users", userOther);
        cy.login(userOther.username, userOther.password);
        cy.get("span").should("contain", `${blog.title} ${blog.author}`).parent().find("button").contains("Show").click();
        cy.get("button").should("not.contain", "Delete");
      });
    });

    describe("Blogs created", function () {
      beforeEach(function () {
        cy.createBlog(blog).then(function () {
          cy.get("@blogID").then(function (id) {
            cy.likeBlog(id, 2);
          });
        });

        cy.createBlog(blogR1).then(function () {
          cy.get("@blogID").then(function (id) {
            cy.likeBlog(id, 20);
          });
        });
        cy.createBlog(blogR2).then(function () {
          cy.get("@blogID").then(function (id) {
            cy.likeBlog(id, 7);
          });
        });
        cy.createBlog(blogR3).then(function () {
          cy.get("@blogID").then(function (id) {
            cy.likeBlog(id, 132);
          });
        });
      });

      it("Blogs sorted by likes DESC", function () {
        cy.get("button:contains('Show')").each(function (element) {
          element.click();
        });
        cy.get("button.sortButton").click();
        cy.get("button.sortButton").click();
        cy.get("button.sortButton").contains("sorting by likes DESC");
        cy.get("span.blogTitle").eq(0).contains(`${blogR3.title} ${blogR3.author}`);
        cy.get("span.blogTitle").eq(1).contains(`${blogR1.title} ${blogR1.author}`);
        cy.get("span.blogTitle").eq(2).contains(`${blogR2.title} ${blogR2.author}`);
        cy.get("span.blogTitle").eq(3).contains(`${blog.title} ${blog.author}`);
      });
    });
  });
});
