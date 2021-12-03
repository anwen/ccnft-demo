# Creative Comomons NFT Playground

- You can try the demo (matic network until now): https://ccnft-test.dweb-lab.com/
- Introducing Creative Comomons NFT Playground (video):  https://www.youtube.com/watch?v=kc6-uu1KhKM

## 📢Tips
- 🌏 Every NFT here is licensed under Creative Commons Attribution 4.0 International License. 🅭
- 🎁 Buying NFT is to donate tokens to the NFT minter(maybe the author). You can't sell it to others.
- 🎓 Please don’t mint anything that doesn’t belong to you. We have a Dweb DAO to help check cheating behavious. (Welcome to join the DAO.)

## 📢注意
- 🌏 这里的所有NFT作品采用知识共享署名-相同方式共享 4.0 国际许可协议进行许可。 🅭
- 🎁 购买NFT仅仅意味着你向NFT铸造者（可能是作品作者）捐款。你不能将该NFT卖给其他人。
- 🎓 请不要将任何不属于你的作品铸造为NFT。 我们有一个Dweb DAO帮助检测欺骗行为。（也欢迎加入）


## The Features
- 🌏 All Creative Commons licensed articles will be stored on IPFS and indexed in dweb search engines(such as Dweb Search).
- 🎁 Authers can mint the articles as NFTs and push them to market with very low gas fee(with Polygon network). Users can buy NFTs (articles) which they like, just for donation.
- 🎓 The NFTs will be stored both on IPFS and Filecoin with nft.storage and Filecoin-Polygon-Bridge so we can help store valuable data on web permanently.


## (O_O)? Question?
- 🔗 We use mumbai test network. You can add it to your Metamask with Chainlist
- 🌏 You can join Dweb Lab Discord
- 🌃 There is also an IPFS version: ipfs://QmSp1Y8TJLQ2dJyYd5uZS7iqGDLPChf2rSsK1R8KkTgY2i


## License
https://opensource.org/licenses/MIT

## IPFS/Filecoin
- Every article is stored as json in ipfs, with IPFS api of infura. code can be found 
- You can choose to store article data in Filecoin by yourself(click the `Store NFT on the Filecoin` button in article page ). It use filecoin-polygon-bridge in  @textile/eth-storage" package. (We use polygon mumbai testnet, you only need some testcoin.)
- You can see how to use the site in: Introducing Creative Comomons NFT Playground (video):  https://www.youtube.com/watch?v=kc6-uu1KhKM
- IPFS code detail is in [pages/create.js](https://github.com/anwen/ccnft-demo/blob/main/pages/create.js)
- Filecoin code detail is in [pages/article.js](https://github.com/anwen/ccnft-demo/blob/main/pages/article.js)


## Design
## 设计
- 1 人类：理想情况下，高质量知识应该免费公开传播 
- 2 作者：作者需要生存
- 3 读者：读者面对众多作品，注意力有限，难以高效分辨作品质量是否符合自己的需求
- 4 市场：如果一个作品能被多次交易，容易让人陷入炒作而非关注作品本身；但部分读者有实力支持作者
- 为了让以上4者更好的共存，提供一个作品发布工具，作品均以CC-BY-SA分享（满足1），无付费墙和传播墙；可选制作为NFT，购买NFT的主要作用是捐赠作者，即使不购买NFT也可以直接给作者捐赠（满足2）； 捐赠也帮助增加作品的影响力，用于3次方投票；读者可自由参考3次方投票辅助选择作品，多了一个选择的维度（满足3）；单个作品只能被购买一次（满足4）

## 博弈分析
- 问题1 作者会考虑自己开多个账号自己买自己的作品来增加影响力。每个策展平台自由选择影响因子算法；而3次方投票仅为其中一个影响因子
- 问题2 作品均可以免费查看，无需NFT，只需给作者捐赠就好。是的，这只是一个用于支持Creative Comomons内容的NFT实验，nft-for-fun
- 问题3 作者可能会重复发自己的作品赚取费用，由于信息公开可查，检测应该不难
- 问题4 NFT流动性差。我们不在乎NFT的流动性

## 名词解释
- CC-BY-SA 知识共享-署名-相同方式共享  (属于自由文化许可协议)
- DwebVerse Marketplace


## NFT使用方法
- step1: 发布metadata信息，信息存在dweb search engine等开放接口的引擎里。信息公开
- step2: mint 只需要支付不到1分钱的gas费用，但作品没有被发到NFT market
- step3: 将NFT发到市场上，可在市场公开查看，需要支付不到1分钱的gas费
- step4: 买家买走
