# Secure Browsing

William Wu  
Luis Vasquez  
Kevin Huynh

This repository contains the source files of Secure Browsing, a Google Chrome extension.

Secure Browsing analyzes and securely saves browsing patterns to estimate user interest in links on a page.

#### Motivation:

Existing websites and services have separate machine learning implementations to best serve the right content to the customer. A browser level model personalizes the browsing experience by training on only one user's entire dataset. A normal service trains only on requests sent to their servers, usually targets the average case, may have a suboptimal recommendation system, and requires registration.

#### Interface

The popup menu is the gateway for authentication, providing signin, signout, and signup forms. When authenticated, the popup transitions into displaying a list of the decrypted most recently viewed links stored in history. The extension page gives more detailed information. Interest scores are annotated above each detectable hard link on page (dynamic links are generated through javascript), and only display on mouse hover.

#### Interest

Suppose that a user is currently viewing page X, and the user navigates to page Y using link A from the set of all links L on X. The user's decision to navigate away using A implies that A is the most interesting/desired url, and that conversely L - {A}, the set of all links except A, are less interesting.

To translate this to a machine learning classification model, the links can be classified: {A: 1.0, L - {A}: 0.0}; "not spam" for the clicked links, and "spam" for the ignored ones. This implies, very loosely, that the content on each of the corresponding pages of the links also shares the same classification (note: a link is also commonly judged by the advertisement around it rather than by its content). Thus, many dimensions of the feature set come from analyzing the html string of each of the pages pointed to by the links.

#### Security

Password SHA256 hashes are stored on disk (indexedDB), along with other account details. The raw password is temporarily stored in browser memory while the user is logged in, and erased at logout. Browser history, from either normal or incognito mode, is encrypted using AES with the raw password and a salt. Though login is purely aesthetic, any unauthorized decryption with an incorrect password still yields unusable data for a malicious user.

Neural network weights are also encrypted. For performance reasons (since the 2d arrays are quite large), the weights are flushed to indexedDB infrequently. References to the weights are removed after logout.

#### Libraries

brain (https://github.com/harthur/brain)

crypto-js (https://code.google.com/archive/p/crypto-js)

#### Installation

1. Navigate to "chrome://extensions"
2. Check "Developer mode"
3. Click "Load unpacked extension..." and choose the folder Secure Browsing

https://developer.chrome.com/extensions/getstarted
