import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import { prettyDOM } from "@testing-library/dom";
import Blog from "./Blog";

describe("Blog tests", () => {
  test("renders blog with author and title", () => {
    const blog = { title: "Digital Warfare", author: "Commander Java S", url: "http://localhost:3000", likes: 20, user: { name: "Anon User" } };
    const component = render(<Blog blog={blog} like={() => {}} deleteBlog={() => {}} user={"unknownUser"}></Blog>);

    const blogContainer = component.container.querySelector("div");
    expect(blogContainer).toHaveTextContent(blog.title);

    expect(component.container).toHaveTextContent(blog.title);
    expect(component.container).toHaveTextContent(blog.author);

    const blogTitleAuhor = component.getByText(`${blog.title} ${blog.author}`);
    expect(blogTitleAuhor).toBeDefined();
    expect(blogContainer).not.toHaveTextContent(blog.url);
    expect(blogContainer).not.toHaveTextContent(blog.likes);
  });

  test("renders blog with all info when button pressed", () => {
    const blog = { title: "Digital Warfare", author: "Commander Java S", url: "http://localhost:3000", likes: 20, user: { name: "Anon User" } };
    const component = render(<Blog blog={blog} like={() => {}} deleteBlog={() => {}} user={"unknownUser"}></Blog>);
    component.debug();
    const button = component.container.querySelector("button");
    fireEvent.click(button);

    const blogContainer = component.container.querySelector("div");
    console.log(prettyDOM(blogContainer));

    expect(component.container).toHaveTextContent(blog.title);
    expect(component.container).toHaveTextContent(blog.author);
    expect(blogContainer).toHaveTextContent(blog.url);
    expect(blogContainer).toHaveTextContent(blog.likes);
  });

  test("test like button press", () => {
    const blog = { title: "Digital Warfare", author: "Commander Java S", url: "http://localhost:3000", likes: 20, user: { name: "Anon User" } };
    const mockFn = jest.fn();
    const component = render(<Blog blog={blog} like={mockFn} deleteBlog={() => {}} user={"unknownUser"}></Blog>);
    const button = component.container.querySelector("button");
    fireEvent.click(button);

    const likeButton = component.getByText("Like 👍");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockFn.mock.calls).toHaveLength(2);
  });
});
