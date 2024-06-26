import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Textarea,
  FormHelperText,
  FormErrorMessage,
  Flex,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import Rating from "./Rating";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { apiPost } from "../../utils/api";

export const ReviewModal = ({ productId, setPageResetted }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loading, token } = useOutletContext();
  const navigate = useNavigate();
  const [reviewError, setReviewError] = useState("");

  const wrappedOnOpen = () => {
    if (loading || !token) {
      navigate("/login");
    } else {
      onOpen();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    apiPost(`products/${productId}/reviews`,
      {
        rating: parseInt(e.target.rating.value),
        text: e.target.content.value,
      }
    ).then(() => {
      onClose();
      setPageResetted(p => !p);
      setReviewError("");

    }).catch((e) => {
      switch (e.status) {
      case 400:
        setReviewError("Your must set rating from 1 to 5 stars!");
        break;
      case 401:
        setReviewError("You need to be logged in to post a review!");
        break;
      case 403:
        setReviewError("You need to be logged in as a user to post a review!");
        break;
      default:
        setReviewError("Unexpected error occured!");
      }
    });
  };

  return (
    <>
      <Button mb={10} alignSelf={"start"} size={"lg"} onClick={wrappedOnOpen}>Write new review</Button>

      <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Form onSubmit={onSubmit}>
            <ModalHeader>Post a Review</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDirection={"column"} gap={10}>
                <Stack>
                  <FormControl isRequired>
                    <Rating size={8} />
                  </FormControl>
                </Stack>

                <Stack>
                  <FormControl isRequired isInvalid={reviewError}>
                    <Textarea maxLength={400} minH={300} fontSize={20} name="content" />
                    {!reviewError ?
                      <FormHelperText>Write your opinion on product!</FormHelperText>
                      :
                      <FormErrorMessage>{reviewError}</FormErrorMessage>
                    }
                  </FormControl>
                </Stack>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button variant={"outline"} mr={3} onClick={onClose}>
                Close
              </Button>
              <Button type="submit">Post a review</Button>
            </ModalFooter>
          </Form >
        </ModalContent>
      </Modal>
    </>
  );
};
