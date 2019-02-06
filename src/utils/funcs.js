import contractMap from 'eth-contract-metadata';
import abiDecoder from 'abi-decoder';
import {
  toChecksumAddress,
} from 'ethereumjs-util';

import * as routes from './routes';
import {
  store
} from '../state/store';

export const normalizeURL = (pathname) => {
  const lowercasePathname = pathname.toLowerCase();
  const fuzzyLowercasePathname = lowercasePathname.charAt(lowercasePathname.length - 1) === '/' ?
    lowercasePathname.slice(0, -1) :
    lowercasePathname;

  return fuzzyLowercasePathname;
};

export const matchProtectedRoutes = (normalizedPath) => {
  if (normalizedPath === routes.ACTIVITY ||
    normalizedPath === routes.DETAILS ||
    normalizedPath === routes.EDIT) {
    return true;
  }
  return false;
};

export const addhttp = (url) => {
  let correctedURL;
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    correctedURL = `http://${url}`;
  } else {
    correctedURL = url;
  }
  return correctedURL;
};

export async function getContract(otherAddress) {
  // limit to five calls a second
  const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${otherAddress}&apikey=${process.env.ETHERSCAN_TOKEN}`);
  if (response.status !== 200) {
    console.log(`Looks like there was a problem. Status Code: ${response.status}`);
    return;
  }
  const data = await response.json();
  // only proceed once second promise is resolved
  return data;
};

export const imageElFor = (address) => {
  const contractMetaData = contractMap[toChecksumAddress(address)];
  if (!contractMetaData || (!('logo' in contractMetaData))) {
    return false;
  }
  // this isnt necessary
  const fileName = contractMetaData.logo;
  const path = `/contractIcons/${fileName}`;
  const contractImg = document.createElement('img');
  contractImg.src = path;
  contractImg.style.width = '100%';
  return [contractImg, contractMetaData];
};

export async function getPublicProfile(graphqlQueryObject) {
  // let profile;
  // try {
  const profile = await Box.profileGraphQL(graphqlQueryObject); // eslint-disable-line no-undef
  // } catch (err) {
  //   // console.log(err);
  // }
  // return profile;
  return profile;
};

const fireDispatch = (publicProfileAddress, feedByAddress) => {
  if (publicProfileAddress) {
    store.dispatch({
      type: 'GET_PUBLIC_PROFILE_ACTIVITY',
      publicProfileActivity: feedByAddress,
      ifFetchingActivity: false,
    });
  } else {
    store.dispatch({
      type: 'UPDATE_ACTIVITY',
      feedByAddress,
      ifFetchingActivity: false,
      isLoggedIn: true,
    });
  }
}

export const updateFeed = (publicProfileAddress, feedByAddress, addressData, isContract) => {
  console.log('addressData', addressData);
  let contractArray = [];
  let counter = 0;

  feedByAddress.map(async (txGroup, i) => {
    const otherAddress = Object.keys(txGroup)[0];
    if (isContract[otherAddress]) { // then address is contract
      abiDecoder.addABI(addressData[otherAddress].contractData);
      txGroup[otherAddress].map((lineItem, index) => {
        const methodCall = abiDecoder.decodeMethod(txGroup[otherAddress][index].input);
        lineItem.methodCall = methodCall && methodCall.name && (methodCall.name.charAt(0).toUpperCase() + methodCall.name.slice(1)).replace(/([A-Z])/g, ' $1').trim();
      });
      contractArray = imageElFor(otherAddress);
      feedByAddress[i].metaData = {
        contractImg: contractArray.length > 0 && contractArray[0],
        contractDetails: contractArray.length > 0 && contractArray[1],
        // contractData,
      };
      counter += 1;
      if (counter === feedByAddress.length) fireDispatch(publicProfileAddress, feedByAddress);
    } else { // look for 3box metadata
      feedByAddress[i].metaData = {
        name: addressData && addressData[otherAddress] && addressData[otherAddress].name,
        image: addressData && addressData[otherAddress] && addressData[otherAddress].image,
      };
      counter += 1;
      console.log('counter profile', counter);
      if (counter === feedByAddress.length) fireDispatch(publicProfileAddress, feedByAddress);
    }
  });
};