# reative Commons NFT Playground (CCNP)

- You can try the demo (matic munbai test network until now): https://ccnft-test.dweb-lab.com/
- Introducing Creative Comomons NFT Playground (video): https://www.youtube.com/watch?v=kc6-uu1KhKM

## Intro

- A new playground for anyone to create, discover, share, reward and distribute articles.
- All articles here are under Creative Commons Attribution 4.0 International License.
- We help turn articles into NFTs. People can buy their loved NFTs for donation purpose.
- Also, we are building a Creator-DAO to assist creators, which we think is the best solution for people to exchange ideas&information more simply and fairly.
- We aim to help create next-generation content communities with pure open-source, open-data, open-protocols and web3 technology.

## 简介

- 一个帮助任何人创建、发现、分享、赞赏、分发文章的游乐场。
- 这里的所有文章都会采用知识共享 4.0 国际许可协议。
- 我们帮助作者将文章变为 NFT。而且大家购买 NFT 只是为了给作者捐赠。
- 另外，我们也在构建一个创作者 DAO 来帮助创作者，人们可以在这里更简单公平地交换想法和信息。
- 我们致力于帮助创建更好的下一代内容社区。我们采用开源、数据和协议开放以及 web3 技术来实现这一目标。

## 📢Tips

- 🌏 Every NFT here is licensed under Creative Commons Attribution 4.0 International License. 🅭
- 🎁 Buying NFT is to donate tokens to the NFT minter(maybe the author). You can't sell it to others.
- 🎓 Please don’t mint anything that doesn’t belong to you. We have a Dweb DAO to help check cheating behavious. (Welcome to join the DAO.)

## 📢 注意

- 🌏 这里的所有 NFT 作品采用知识共享署名-相同方式共享 4.0 国际许可协议进行许可。 🅭
- 🎁 购买 NFT 仅仅意味着你向 NFT 铸造者（可能是作品作者）捐款。你不能将该 NFT 卖给其他人。
- 🎓 请不要将任何不属于你的作品铸造为 NFT。 我们有一个 Dweb DAO 帮助检测欺骗行为。（也欢迎加入）

## The Features

- 🌏 All Creative Commons licensed articles will be stored on IPFS and indexed in dweb search engines(such as Dweb Search).
- 🎁 Authers can mint the articles as NFTs and push them to market with very low gas fee(with Polygon network). Users can buy NFTs (articles) which they like, just for donation.
- 🎓 The NFTs will be stored both on IPFS and Filecoin with nft.storage and Filecoin-Polygon-Bridge so we can help store valuable data on web permanently.

## (O_O)? Question?

- 🔗 We use mumbai test network. You can add it to your Metamask with Chainlist
- 🌏 You can join [Dweb Lab Discord](https://discord.gg/QaEwmJMDJ2)
- 🌃 There is also an IPFS version: ipfs://QmPr6QkVtBdkjyexpNiagTvPTf5yERM4KhkYTjP3pNP1n5

## License

https://www.gnu.org/licenses/agpl-3.0.en.html

## NFT 流程

- step1: 发布文章，信息存在 dweb search engine 等开放接口的引擎里。信息公开
- step2: mint 只需要支付不到 1 分钱的 gas 费用，但作品没有被发到 NFT market
- step3: 将 NFT 发到市场上，可在市场公开查看，需要支付不到 1 分钱的 gas 费
- step4: 买家买走，只是作为捐赠

## 作品激进市场 3 次方策展实验

### 角色

- 1 人类： 理想情况下，高质量知识应该免费公开传播
- 2 作者： 作者需要 A 生存，B 高质量交流，C 读者至少其中之一
- 3 读者： A 读者面对众多作品，注意力有限，难以高效分辨作品质量是否符合自己的需求；B 读者的注意力是有价值的但很少得到报酬
- 4 市场： A 若一个 NFT 作品能被多次交易，容易让人陷入炒作而非关注作品本身；B 部分读者有实力支持作者，可以尽量降低支持的门槛

### 分析

- 为了让以上 4 者更好的共存，提供一个市场，作品均以 CC-BY-SA 许可协议分享（满足 1），并制作 NFT，购买 NFT 的作用是支持作者（满足 2A）以及帮助促进优质作品的传播（用 2 次方投票）（满足 2C）；读者参考 2 次方投票选择作品，多了一个选择的维度（满足 3A）；单个作品的单个版本（作者可以持续更新）只能被低价购买一次（满足 4A 4B）
- 额外 1： 创作者、读者、市场提供者组成的 DAO 可以获取 NFT 购买的少量分成，用于能敏锐发现优质作品的读者以及维护市场和内容社区的正常运行
- 额外 2： 创作和捐赠（购买 NFT）的行为需要被鼓励，本身也消耗 gas，当完成这两种行为，可以获得作为创作证明和捐赠证明的 ERC20 积分（积分本身没任何价值，只是记录价值）

## 名词解释

- CC-BY-SA 知识共享-署名-相同方式共享 (属于自由文化许可协议)

### 博弈的漏洞分析

- 问题 1 自己购买自己的作品刷分。由于单个作品采用 2 次方投票（或改进版），且目前作品统一由 DAO 定价，即使被刷单 100 次，得分也只是正常 10 次赞赏作品的得分的 10 倍，且这仅仅是其中一个影响因子
- 问题 2 作品均可以免费查看和第三方策展，无需这样的排序，只需给作者捐赠就好。 是的，这是一个激进市场策展排序实验，不保证一定效果好
- 问题 3 作者可能会重复发自己的作品赚取费用，由于信息公开可查，检测应该不难，鼓励作者每次 mint 都更新和改进作品
- 问题 4 NFT 流动性差。捐赠无需流动性。不在考虑范围内
