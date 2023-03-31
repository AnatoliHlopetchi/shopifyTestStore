/* eslint-disable no-param-reassign */
/*
  example wishlist object data
  { lastUpdated: 1845023982,
    items: {
      '091842145': {
        'inWishlist': true,
        'updatedAt': 1845023982
      },
      '08402038812': {
        'inWishlist': false,
        'updatedAt': 18350233302
      }
    }
  }
*/

const getLocalWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('askphill_wishlist'));
  } catch (e) {
    localStorage.removeItem('askphill_wishlist');

    return null;
  }
};

const checkIfWishlistHasItems = () => {
  const wishlist = getLocalWishlist();
  const wishlistItems = wishlist.items;
  // finds first wishlistItem with inWishlist === true --> !! turns it into boolean
  return !!Object.keys(wishlistItems).find(key => wishlistItems[key].inWishlist);
};

export const updateHeaderWishlistButton = wishlist => {
  const headerWishlistButton = document.querySelector('[data-wishlist-toggle]');
  if (headerWishlistButton) {
    headerWishlistButton.classList[checkIfWishlistHasItems(wishlist) ? 'add' : 'remove'](
      'wishlist-active'
    );
  }
};

const updateLocalWishlist = wishlist => {
  localStorage.setItem('askphill_wishlist', JSON.stringify(wishlist));
};

const updateRemoteWishlist = async ({ wishlist, email }) => {
  const response = await fetch(`${window.Phill.wishlist_endpoint}/api/wishlist`, {
    body: JSON.stringify({ email, wishlist }),
    method: 'POST',
  });
  if (!response.ok) {
    console.error('Error occured when updating remote wishlist: ', response.status);
  }
};

const combineWishlists = (wishlist1, wishlist2) => {
  // get all unique productIds (object keys) to iterate with
  const allProductIds = Object.keys({ ...wishlist1.items, ...wishlist2.items });
  const latestUpdatedAt =
    wishlist1.lastUpdated > wishlist2.lastUpdated ? wishlist1.lastUpdated : wishlist2.lastUpdated;
  const combinedWishlist = {
    lastUpdated: latestUpdatedAt,
    items: {},
  };

  allProductIds.forEach(productId => {
    // If the item exists on both wishlists
    if (wishlist1.items[productId] && wishlist2.items[productId]) {
      // if their timestamps are the same, return any
      if (wishlist1.items[productId].updatedAt === wishlist2.items[productId].updatedAt) {
        combinedWishlist.items[productId] = {
          ...wishlist1.items[productId],
        };
      } else {
        // else, find the one with the latest timestamp, use that wishlist's data
        const wishlistWithLatestData =
          wishlist1.items[productId].updatedAt > wishlist2.items[productId].updatedAt
            ? wishlist1
            : wishlist2;
        combinedWishlist.items[productId] = {
          ...wishlistWithLatestData.items[productId],
        };
      }
    } else {
      // else it only exists in 1 wishlist, return that wishlist's data
      const wishlistWithExistingData = wishlist1.items[productId] ? wishlist1 : wishlist2;
      combinedWishlist.items[productId] = {
        ...wishlistWithExistingData.items[productId],
      };
    }
  });
  return combinedWishlist;
};

// In body.js, we first do this step landing on each page, to determine quickly if the data is out of sync (and sync) or if we can use local/empty wishlist data
// Once we determine what's the 'correct' data, we use that to update the headerWishlistButton state (if the wishlist icon should be filled in or not)
export const initWishlist = async () => {
  const emptyWishlist = {
    lastUpdated: null,
    items: {},
  };
  const localWishlist = getLocalWishlist();

  // If customer isn't logged in, return local (or empty) wishlist
  if (!window.Phill.customer) {
    if (!localWishlist) {
      // If there is no localWishlist yet, set it to emptyWishlist state
      updateLocalWishlist(emptyWishlist);
      updateHeaderWishlistButton(emptyWishlist);
      return;
    }
    updateHeaderWishlistButton(localWishlist);
    return;
  }

  // if customer is logged in, get the remote wishlist
  const remoteWishlist = window.Phill.wishlist;
  // wishlist objects without a lastUpdated value means it's undefined/empty

  // remote and local wishlists are null, use emptyWishlist state
  if (!remoteWishlist?.lastUpdated && !localWishlist?.lastUpdated) {
    updateLocalWishlist(emptyWishlist);
    // no need to sync to remote since it's still empty. Let's save on API calls
    updateHeaderWishlistButton(emptyWishlist);
    return;
  }

  // if there's no remote wishlist, but a local one, use local and updateRemote
  if (localWishlist?.lastUpdated && !remoteWishlist?.lastUpdated) {
    updateHeaderWishlistButton(localWishlist);
    await updateRemoteWishlist({ wishlist: localWishlist, email: window.Phill.customer });
    return;
  }

  // if there's no local wishlist, but a remote one, use remote and updateLocal
  if (remoteWishlist.lastUpdated && !localWishlist?.lastUpdated) {
    updateLocalWishlist(remoteWishlist);
    updateHeaderWishlistButton(remoteWishlist);
    return;
  }

  // else local AND remote wishlists exists
  if (localWishlist.lastUpdated === remoteWishlist.lastUpdated) {
    // if theyre the same, use whichever
    updateHeaderWishlistButton(localWishlist);
    return;
  }
  // else, they both exist and they're different! sync between the two

  // combine both wishlists
  const combinedWishlist = combineWishlists(localWishlist, remoteWishlist);

  // Store locally
  updateLocalWishlist(combinedWishlist);
  updateHeaderWishlistButton(combinedWishlist);

  // AWAIT POST local one to customer metafield
  await updateRemoteWishlist({ wishlist: combinedWishlist, email: window.Phill.customer });
};

export const checkIfInWishlist = productId => {
  const wishlist = getLocalWishlist();
  const wishlistItems = wishlist.items;
  return wishlistItems[productId] ? wishlistItems[productId].inWishlist : false;
};

export const addToWishlist = productId => {
  const wishlist = getLocalWishlist();
  const wishlistItems = wishlist.items;
  const currentTimestamp = Date.now();
  if (wishlistItems[productId]) {
    // productId already exists, update
    wishlistItems[productId].inWishlist = true;
    wishlistItems[productId].updatedAt = currentTimestamp;
    wishlist.lastUpdated = currentTimestamp;
  } else {
    // productId doesn't exist, create
    wishlistItems[productId] = {
      inWishlist: true,
      updatedAt: currentTimestamp,
    };
    wishlist.lastUpdated = currentTimestamp;
  }
  updateLocalWishlist(wishlist);
  updateHeaderWishlistButton(wishlist);
  if (window.Phill.customer) {
    return updateRemoteWishlist({ wishlist, email: window.Phill.customer });
  }
};
export const removeFromWishlist = productId => {
  /* Even with removing from wishlist, we need to update this state rather than delete
    so that we save the user's latest 'intention' across local and remote
  */
  const wishlist = getLocalWishlist();
  const wishlistItems = wishlist.items;
  const currentTimestamp = Date.now();
  wishlistItems[productId].inWishlist = false;
  wishlistItems[productId].updatedAt = currentTimestamp;
  wishlist.lastUpdated = currentTimestamp;

  updateLocalWishlist(wishlist);
  updateHeaderWishlistButton(wishlist);
  if (window.Phill.customer) {
    return updateRemoteWishlist({ wishlist, email: window.Phill.customer });
  }
};

export const initWishlistButton = (button, productId) => {
  if (!button) return;

  const initButton = () => {
    const setActive = isActive => {
      button.classList[isActive ? 'add' : 'remove']('wishlist-active');
    };

    setActive(checkIfInWishlist(productId));

    button.addEventListener('click', async e => {
      e.stopPropagation();

      if (checkIfInWishlist(productId)) {
        setActive(false);
        /* We wanted the wishlist to feel extra snappy, so we are visually removing the product from the DOM immediately on click, and firing the call after
          This is why wishlist:removeProduct is emitted before removeFromWishlist()
          From client use so far + internal testing, this was sufficient and the calls were fast enough. But make the adjustments as needed for your client
        */
        window.app.emit('wishlist:removeProduct', { productId });
        await removeFromWishlist(productId);
      } else {
        setActive(true);
        await addToWishlist(productId);
        window.app.emit('wishlist:addProduct');
      }
    });
  };

  if (window.app.getState().wishlistSynced) {
    initButton();
  } else {
    window.app.on('wishlist:synced', initButton);
  }
};

export const fetchWishlistProductsHtml = async productIds => {
  const response = await fetch(`/search?section_id=wishlist-products&q=${productIds}`);
  const text = await response.text();

  if (!response.ok) {
    console.error('Error occured when fetching wishlist products: ', response.status);
  } else {
    return new DOMParser().parseFromString(text, 'text/html');
  }

  return null;
};
