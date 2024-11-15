import { Contract, ethers, providers, utils } from "ethers";
import { parseUnits } from "viem";

/**
 * copy text to clipboard
 * @param text
 */
export const copyToClipboard = async (text: string) => {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    // message.info(`Copied ${text}`)
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      // message.info(`Copied ${text}`)
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
};
/**
 * reduce balance
 * @if not number, return "0";
 * @if > 10e+7 10M
 * @if > 10e+4 10K
 * @if 0.001234 0.0012
 * @if 1.000000 1
 *
 * @param number 12.0000123451
 * @returns string
 *
 */
export const reduceAmount = (number: number | string | unknown | bigint, len = 2) => {
  try {
    if (isNaN(Number(number))) throw "0";
    const num = Math.floor(Number(number));
    if (num >= 10 ** 7) throw (num / 10 ** 6).toFixed(2) + "M";
    if (num >= 10 ** 4) throw (num / 10 ** 3).toFixed(2) + "K";
    const decimal = ((number as number) - num).toFixed(20);
    let count = 0;
    let word = true;
    for (let i = 2; i < decimal.length; i++) {
      if (decimal[i] == "0") {
        count++;
      } else {
        word = false;
        break;
      }
    }
    // count = 0;
    if (word || count > 8) {
      throw num;
    } else {
      const _deciaml = Number(decimal).toFixed(count + len);
      throw num + _deciaml.substring(1, _deciaml.length);
    }
  } catch (value: any) {
    return value as string;
  }
};
/**
 * reduce balance
 * @if not number, return "0";
 * @if 0.001234 0.0012
 * @if 1.000000 1
 *
 * @param number 12.0000123451
 * @returns string
 *
 */
export const parseNumber = (number: number | string | unknown, len = 2) => {
  try {
    if (isNaN(number as number)) throw "0";
    const num = Math.floor(number as number);
    const decimal = ((number as number) - num).toLocaleString();

    console.log(num, decimal);
    let count = 0;
    for (let i = 2; i < decimal.length; i++) {
      if (decimal[i] == "0") {
        count++;
      } else {
        break;
      }
    }
    // count = 0;
    const _deciaml = Number(decimal).toFixed(count + len);
    throw num + _deciaml.substring(1, _deciaml.length);
  } catch (value: any) {
    return value as number;
  }
};

/**
 * reduce address to shorter
 * @param address "0x29f95970cd0dd72cd7d6163b78693fe845daf796"
 * @param length length to cut from start and end
 * @returns "0x2...796"
 */
export const reduceAddress = (
  address: string = "0x29f95970cd0dd72cd7d6163b78693fe845daf796",
  length: number = 4
) => {
  return (
    address.substring(0, length) +
    "..." +
    address.substr(address.length - length, length)
  );
};
// @dev generate random number
export const _randomNumber = () => {
  return Math.floor(Math.random() * 1000000000);
}

// @dev get id from youtube link
export const _getYoutubeId = (url: string) => {
  var match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
  return match ? match[1] : null;
}

// @dev get id from youtube link
export const _getYoutubeThumbnailURL = (url: string) => {
  var match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
  return match ? `https://i.ytimg.com/vi/${match[1]}/maxresdefault.jpg` : "";
}
/**
 * get ETH price from uniswapv2 pool
 * @returns 
 */
export const getETHPrice = async () => {
  try {
    const uniswapPairAddress = "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852";
    // Connect to Ethereum
    const jsonRpcProvider = new providers.JsonRpcBatchProvider(process.env.NEXT_PUBLIC_RPC_ETHEREUM);

    // Load Uniswap's ETH/USDT pair contract
    const uniswapPairContract = new Contract(
      uniswapPairAddress,
      [
        "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
      ],
      jsonRpcProvider
    );

    // Get reserves (in this case, ETH and USDT reserves)
    const reserves = await uniswapPairContract.getReserves();
    const reserveETH = reserves.reserve0;
    const reserveUSDT = reserves.reserve1;

    // Calculate ETH price in terms of USDT
    const ethPriceInUSDT = reserveUSDT * 1e18 / (reserveETH * 1e6);
    return Number(ethPriceInUSDT);
  } catch (err) {
    console.log(err)
    return 0;
  }
};
/**
 * get BNB price from uniswapv2 pool
 * @returns 
 */
export const getBNBPrice = async () => {
  try {
    const uniswapPairAddress = "0x1b96b92314c44b159149f7e0303511fb2fc4774f";
    // Connect to Ethereum
    const jsonRpcProvider = new providers.JsonRpcBatchProvider(process.env.NEXT_PUBLIC_PRC_BSC);

    // Load Uniswap's ETH/USDT pair contract
    const uniswapPairContract = new ethers.Contract(
      uniswapPairAddress,
      [
        "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
      ],
      jsonRpcProvider
    );

    // Get reserves (in this case, ETH and USDT reserves)
    const reserves = await uniswapPairContract.getReserves();
    const reserveBNB = reserves.reserve0;
    const reserveUSDT = reserves.reserve1;

    console.log(Number(reserveUSDT), Number(reserveBNB))
    // Calculate BNB price in terms of USDT
    const bnbPriceInUSDT = reserveUSDT / reserveBNB;
    return Number(bnbPriceInUSDT);
  } catch (err) {
    console.log(err)
    return 0;
  }
};

// Function to encode a string to Base64
export function encodeBase64(input: string) {
  return btoa(unescape(encodeURIComponent(input)));
}

// Function to decode a Base64 string back to its original form
export function decodeBase64(encoded: string) {
  return decodeURIComponent(escape(atob(encoded)));
}