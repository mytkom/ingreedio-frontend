import { Grid, Center, Spinner, Text, Flex, Stack, Button } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { ProductCard } from "./ProductCard";
import { useEffect, useRef, useState } from "react";
import usePagination from "../../hooks/usePagination";
import { Link } from "react-router-dom";
import { PanelCreateProductModal } from "../PanelCreateProductModal";

export const PanelProductList = ({ searchData, productsPerPage, isAuthorized, endpoint }) => {
  const mountedRef = useRef(false);
  const [queryParams, setQueryParams] = useState(
    {
      query: searchData.query,
      categoryId: searchData.category?.value,
      ingredients: searchData.ingredients.map(ingredient => ingredient.value),
      sortBy: searchData.sortBy,
    }
  );
  const [products, setProducts] = useState(null);
  const [next, prev, page, maxPage, setPageResetted] = usePagination(endpoint, (contents) => setProducts(contents), queryParams, 0, productsPerPage);

  useEffect(() => {
    if (mountedRef.current) {
      setQueryParams(
        {
          query: searchData.query,
          categoryId: searchData.category?.value,
          ingredients: searchData.ingredients.map(ingredient => ingredient.value),
          preferenceId: searchData.preference?.value,
          sortBy: searchData.sortBy,
        }
      );
    } else {
      mountedRef.current = true;
    }
  }, [searchData]);

  return (
    <>
      <PanelCreateProductModal setPageResetted={setPageResetted} />
      <Center>
        {products ?
          products.length > 0 ?
            <Stack
              mb={20}
              fontSize={"20px"}
              color={"brand.greenishGray"}
              fontWeight={900} >
              <Grid
                templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                gap={{ base: 4, md: 8, lg: 10 }}
                maxW="100%"
                p={{ base: 4, md: 8, lg: 10 }}
              >
                {products.map((product) => {
                  return (
                    <Link key={product.id} to={`/product/${product.id}`}>
                      <ProductCard product={product} isAuthorized={isAuthorized} />
                    </Link>
                  );
                })}
              </Grid>
              <Flex
                justifyContent={"center"}
                gap={5}
                alignItems={"center"}>
                <Button
                  size={"md"}
                  isDisabled={page === 0}
                  onClick={prev}
                ><ChevronLeftIcon fontSize={"lg"} /></Button>
                <Text>
                  {page}
                </Text>
                <Button
                  isDisabled={page === maxPage}
                  onClick={next}
                  size={"md"}><ChevronRightIcon fontSize={"lg"} /></Button>
              </Flex>
            </Stack>
            :
            <Text
              mt={20}
              fontFamily="Playfair Display"
              fontWeight={900}
              color={"brand.greenishGray"}
              fontSize={{ base: "20px", sm: "30px", md: "40px", xl: "55px" }}>
              No results found
            </Text>
          :
          <Spinner mt={20} />
        }
      </Center>
    </>
  );
};
