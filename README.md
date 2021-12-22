# Creative Comomons NFT Playground

- You can try the demo (matic network until now): https://ccnft-test.dweb-lab.com/
- Introducing Creative Comomons NFT Playground (video):  https://www.youtube.com/watch?v=kc6-uu1KhKM


## Intro
A new playground for anyone to create, discover, share, reward and distribute articles.
All articles here are under Creative Commons Attribution 4.0 International License.
We help turn articles into NFTs. People can buy their loved NFTs for donation purpose.

Also, we are building a Creator-DAO to assist creators, which we think is the best solution for people to exchange ideas&information more simply and fairly.
We aim to help create next-generation content communities with pure open-source, open-data, open-protocols and web3 technology.

## 简介
一个帮助任何人创建、发现、分享、赞赏、分发文章的游乐场。
这里的所有文章都会采用知识共享4.0国际许可协议。
我们帮助作者将文章变为NFT。而且大家购买NFT只是为了给作者捐赠。
另外，我们也在构建一个创作者DAO来帮助创作者，人们可以在这里更简单公平地交换想法和信息。
我们致力于帮助创建更好的下一代内容社区。我们采用开源、数据和协议开放以及web3技术来实现这一目标。


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


## Design
### 角色

- 1 人类：理想情况下，高质量知识应该免费公开传播
- 2 作者：作者需要生存
- 3 读者：读者面对众多作品，注意力有限，无法高效分辨作品质量是否符合自己的需求
- 4 市场：如果一个作品能被多次交易，容易让人陷入炒作而非关注作品本身；但部分读者有实力支持作者
- 为了让以上4者更好的共存，提供一个市场，作品均以CC_BY_SA分享（满足1），并制作NFT，购买NFT的唯一作用就是帮助增加作品的影响力，用于3次方投票（满足2）；读者参考3次方投票选择作品，多了一个选择的维度（满足3）；单个作品只能被购买一次（满足4）

### 博弈的漏洞分析

- 问题1 自己购买自己的作品刷分。由于单个作品采用3次方投票，且目前作品统一由dao定价，即使被刷单10000次，得分也只是正常10次赞赏作品的得分的10倍，且这仅仅是一个影响因子
- 问题2  作品均可以免费查看，无需这样的排序，只需给作者捐赠就好。 是的，这只是一个激进市场策展排序实验，不保证一定效果好
- 问题3  作者可能会重复发自己的作品赚取费用，由于信息公开可查，检测应该不难，期待作者每次更新和改进作品
- 问题4 流动性差。捐赠无需流动性。不在考虑范围内。如果实在哪天有实力支持作者的读者缺钱用了，可以采用出售账号私钥的方式

## 名词解释
- CC-BY-SA 知识共享-署名-相同方式共享  (属于自由文化许可协议)

## NFT流程
- step1: 发布metadata信息，信息存在dweb search engine等开放接口的引擎里。信息公开
- step2: mint 只需要支付不到1分钱的gas费用，但作品没有被发到NFT market
- step3: 将NFT发到市场上，可在市场公开查看，需要支付不到1分钱的gas费
- step4: 买家买走
