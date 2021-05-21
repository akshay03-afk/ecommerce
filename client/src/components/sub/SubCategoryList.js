import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubCategories } from "../../functions/subCategory";
import Loader from "../Loader";

const SubCategoryList = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubCategories().then((c) => {
      setSubCategories(c.data);
      setLoading(false);
    });
  }, []);

  const showSubCategories = () =>
    subCategories.map((s) => (
      <div
        key={s._id}
        className="col btn btn-outline-secondary btn-block  m-3"
      >
        <Link to={`/sub/${s.slug}`}>{s.name}</Link>
      </div>
    ));

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <Loader />
        ) : (
          showSubCategories()
        )}
      </div>
    </div>
  );
};

export default SubCategoryList;
