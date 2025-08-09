import { message } from "antd";
import { useEffect, useState } from "react";
import { getService } from "../../../services/services";

export const useBlog = (blogId) => {
  const blogsService = getService("blog-posts");
  const [blogData, setBlogData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const getBlogData = (blogId) => {
    setLoading(true);
    blogsService
      .get(Number(blogId))
      .then((response) => {
        setBlogData(response);
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (blogId) {
      getBlogData(blogId);
    } else {
      setLoading(false)
    }
  }, [blogId]);

  return {
    isLoading,
    blogData,
    getBlogData,
  };
};
