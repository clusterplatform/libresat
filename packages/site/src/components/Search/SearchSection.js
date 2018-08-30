import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { SearchFilter } from "./Search";
import { withPrefix } from "gatsby-link";

const Search = ({
  data: {
    allMdx: { edges },
    allSitePage: { totalCount }
  },
  ...otherProps
}) => (
  <SearchFilter
    placeholder={`Search ${totalCount} ${
      totalCount === 1 ? "page" : "pages"
    } ...`}
    source={edges.map(
      ({
        node: {
          rawBody,
          frontmatter: { author, title, imgSrc, date },
          headings,
          excerpt,
          fileNode: { name }
        }
      }) => {
        return {
          body: rawBody,
          imgSrc: withPrefix(imgSrc),
          link: /[0-9]+-[0-9]+-[0-9]+(.*)/.test(name)
            ? withPrefix(`/blog/${name}`)
            : name === "index"
              ? withPrefix("/")
              : withPrefix(name),
          header:
            headings.filter(({ depth }) => depth === 1).length === 0
              ? title
              : headings.filter(({ depth }) => depth === 1)[0].value,
          meta: `${
            date
              ? new Date(date).toLocaleDateString()
              : new Date(
                  name
                    .split("-")
                    .filter((element, index) => (index < 3 ? element : null)) // Get the date from the post's filename, like with Jekyll
                    .join("-")
                ).toLocaleDateString()
          } by ${author}`,
          description: excerpt
        };
      }
    )}
    {...otherProps}
  />
);

export const SearchSection = props => (
  <StaticQuery
    query={graphql`
      query SiteSearch {
        allMdx {
          edges {
            node {
              rawBody
              fileNode {
                name
              }
              headings {
                value
                depth
              }
              frontmatter {
                author
                imgSrc
                title
                date
              }
              excerpt
            }
          }
        }
        allSitePage {
          totalCount
        }
      }
    `}
    render={data => <Search data={data} {...props} />}
  />
);
