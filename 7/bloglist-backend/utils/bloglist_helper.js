const _ = require("lodash");

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (total, blog) => {
    return total + blog.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const mostLikes = Math.max(...blogs.map((blog) => blog.likes));
  return blogs[blogs.findIndex((blog) => blog.likes === mostLikes)];
};

const mostBlogs = (blogs) => {
  const blogAuthors = _.map(_.countBy(blogs, "author"), (blogCount, author) => {
    return { author, blogs: blogCount };
  });
  return _.maxBy(blogAuthors, "blogs");
};

const mostLikes = (blogs) => {
  const blogsByAuthor = _.map(_.groupBy(blogs, "author"), (blogs, author) => {
    return { author, likes: _.sumBy(blogs, "likes") };
  });

  return _.maxBy(blogsByAuthor, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
