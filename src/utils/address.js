import {
  store,
} from '../state/store';

// import history from '../history';

export let address = typeof web3 !== 'undefined' ? web3.eth.accounts[0] : ''; // eslint-disable-line no-undef

const checkAddress = setInterval(() => {
  const currentAddress = typeof web3 !== 'undefined' ? web3.eth.accounts[0] : ''; // eslint-disable-line no-undef

  // Logged out
  if (currentAddress !== address && currentAddress === undefined) {
    clearInterval(checkAddress);
    store.dispatch({
      type: 'SHOW_LOGGEDOUT_MODAL',
      loggedOutModal: true,
    });
    //     history.push({
    //       pathname: '/',
    //     });
    // window.location.reload();
  }

  // Switched address
  if (currentAddress !== address && typeof currentAddress === 'string' && address !== undefined) {
    clearInterval(checkAddress);
    store.dispatch({
      type: 'SHOW_SWITCHED_ADDRESS_MODAL',
      switchedAddressModal: true,
    });
  }

  // Logged in to MM
  if (currentAddress !== address && typeof currentAddress === 'string' && address === undefined) {
    clearInterval(checkAddress);
    window.location.reload();
  }
}, 1000);

export {
  address as
  default,
};