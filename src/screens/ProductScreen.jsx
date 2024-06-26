import { useState, useEffect } from "react";
import { ProductDetails } from "../components/ProductDetails/ProductDetails";
import { useParams, useOutletContext } from "react-router-dom";
import { apiGet } from "../utils/api";
import usePagination from "../hooks/usePagination";
import { Center, Text } from "@chakra-ui/react";

export const ProductScreen = () => {
  const { productId } = useParams();
  const [editable, setEditable] = useState(false);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [queryParams] = useState({});
  const { role } = useOutletContext();
  const [next, prev, page, maxPage, setPageResetted] = usePagination(`products/${productId}/reviews`, (contents) => setReviews(contents), queryParams, 0, 4);

  useEffect(() => {
    apiGet(`Panel/products/${productId}`)
      .then(data => {
        setProduct(data);
        if (role !== "Moderator")
          setEditable(true);
      }).catch(() => {
        apiGet(`products/${productId}`)
          .then(data => {
            setProduct(data);
            setEditable(false);
          }).catch((e) => {
            switch(e.status) {
            case 404:
              setError("Product not found!");
              break;
            default:
              setError("Cannot display product!");
              break;
            }
          });
      });
  }
  , [productId, reviews, role]);

  if(error && error.length > 0) {
    return <Center><Text>{error}</Text></Center>;
  }


  return <ProductDetails product={product} reviews={reviews} prev={prev} next={next} setPageResetted={setPageResetted} maxPage={maxPage} page={page} isEditable={editable} />;
};
