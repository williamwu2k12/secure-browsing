# Secure Browsing

William Wu  
Luis Vasquez  
Kevin Huynh


## Planned Features


### Problem and Solution

Many existing websites/services have great implementations of machine learning techniques that attempt to solve the search problem of returning the right results for a query, or for any user based on their past search history on that website. For example, Google has Page Rank, and Facebook has the News Feed. Other sites, such as Stack Overflow and Amazon, also have their own algorithms. There are also a lot of sites that don't implement any machine learning techniques. In general, however, the search solution is targeted in solving the average case, and limited in their data, which are only the server requests to their specific site. With these limitations, the websites can infer what is generally useful and what is not. They can also infer what is generally useful to each specific registered user.

There is a solution that augments the existing solution. Individual browsing history is a super valuable resource that contains a huge amount of data; every day, a user can browse approximately 1000 links. Individual browsing history is a much better indicator of a user's preferences, and is a resource that every company does not have access to (each website only has access to requests to their own servers). In addition, this data's sequence is also super important; to solve a problem, the user makes many choices of which links to click on and which ones to ignore.

The solution, therefore, is to run a neural network locally on the browsing history. Because neural networks generally take a long time to train, the browser can iterate on each new link browsed, and each link not browsed. This will minimize the amount of computation spikes, and make machine learning actually feasible on every device, especially computers. Neural network quality is highly dependent on featurization and filtration decisions. A bag of words model of the most frequent words, removing HTML tags and ignoring image and videos, might be an interesting idea.

On the user side, the augmentation follows the Avast Antivirus model. Avast labels each link on a page with a security rating (colored red for dangerous, green for safe). For this Chrome extension solution, each link on a page can be labeled with the neural network's prediction on its usefulness (colors or numbers).

With such sensitive data, security is an extremely relevant concern. Neural network weights and browsing history should be encrypted, since this is personal user data. Because of this, database design should account for encryption, as well as indexing.


### Security
- multiple layers of security and different encryptions for databases
- password protection with different commands for each key
    - delete all caches, browsing history, bookmarks, favorites
    - open a fake database, pregenerated based on public browsing history
    - open the actual database
- pregenerated key file required with the actual password


### Browsing
- general browsing
    - saved tabsets as major points on a timeline, since most successful searches end with a close
    - link filters, blacklists and whitelists, to avoid seeing previously viewed links
- favoriting, rating, bookmarking, with sourcing and external links or mirrors for the same content
    - link downloading, using curl
    - link preloading to avoid waiting on large videos
- recommendations
    - linklist public sharing
    - search term analysis with recommendations using google api
    - link analysis with graphs on frequency of viewing
    - recommendations for search engines
- bookmark vids to favorite moments
    - instant replay, fast forward, slow down
    - looping (going forward, then going backward), gif creation
    - facial recognition and comparison with imdb


### Analysis
- parent/child tree, displayed as an actual tree
    - show animation of depth-first search, breadth-first search, user-defined search
    - each node has a parent reference and a child reference
- graphs of frequency of site visits
    - filter by domain, search term, time of access


Cited Resources
- https://www.iconfinder.com/search/?q=iconset:flat-ui-free-2 or http://iconfindr.com/1sONVsY