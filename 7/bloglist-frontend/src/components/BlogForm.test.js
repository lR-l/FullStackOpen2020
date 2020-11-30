import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import BlogForm from "./BlogForm";

describe("Blogform tests", () => {
  test("Call blog create function with input values form submit", () => {
    const createBlogMock = jest.fn();
    const blogForm = render(<BlogForm createBlog={createBlogMock}></BlogForm>);

    const titleInput = blogForm.container.querySelector("#title");
    const authorInput = blogForm.container.querySelector("#author");
    const urlInput = blogForm.container.querySelector("#url");
    const form = blogForm.container.querySelector("form");

    const title = "Spot a unicorn in traffic";
    const author = "Sparklie";
    const url = "http://localhost:3001/api/stories/412526a";
    fireEvent.change(titleInput, { target: { value: title } });
    fireEvent.change(authorInput, { target: { value: author } });
    fireEvent.change(urlInput, { target: { value: url } });
    fireEvent.submit(form);

    expect(createBlogMock.mock.calls).toHaveLength(1);
    const mockValues = createBlogMock.mock.calls[0];
    expect(mockValues[0]).toBe(title);
    expect(mockValues[1]).toBe(author);
    expect(mockValues[2]).toBe(url);
  });
});
