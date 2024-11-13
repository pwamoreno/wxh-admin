"use client";

import CollectionForm from "@/components/collections/CollectionForm";
import Loader from "@/components/custom ui/Loader";
import { useEffect, useState } from "react";

const CollectionDetails = ({
  params,
}: {
  params: { collectionsid: string };
}) => {
  const [loading, setLoading] = useState(true);
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionType | null>(null);

  const getCollectionDetails = async () => {
    try {
      const res = await fetch(`/api/collections/${params.collectionsid}`, {
        method: "GET",
      });
      const data = await res.json();
      setCollectionDetails(data);
      setLoading(false);
    } catch (error) {
      console.log("[collectionid_GET]", error);
    }
  };

  useEffect(() => {
    getCollectionDetails();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <CollectionForm initialData={collectionDetails} />
  );
};

export default CollectionDetails;
