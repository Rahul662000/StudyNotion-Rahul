import React from 'react'
import { toast } from 'react-hot-toast'
import { APIConnector } from '../APIConnector';
import { catalogData } from '../APIs';

export const getCatalogPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...")
  // console.log("Category Id",categoryId)
  let result = [];
  try{

    const response = await APIConnector("POST",catalogData.CATALOGPAGEDATA_API , { categoryId:categoryId });

    if(!response?.data?.success){
      throw new Error("Could not fetch category page Data")
    }

    result = response?.data;

  }
  catch(error){
    console.log("Catalog Page Data API Error" , error)
    toast.error (error.message)
    result = error.response?.data
  }
  toast.dismiss(toastId);
  return result
}
