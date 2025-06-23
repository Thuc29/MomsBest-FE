import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js"

const ChecksumKey = "27f2b6dda6f2d3258319384fbc7c468064075c3e59fdaed01eb2f29b3c7f4f87"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getRegexEmail = () => {
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
  return re
}

export const randomNumber = () => {
  const min = 100000
  const max = 999999
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNumber
}

export const generateSignature = (data) => {
  const hmac = CryptoJS.HmacSHA256(data, ChecksumKey)
  const signature = hmac.toString(CryptoJS.enc.Hex)
  return signature
}