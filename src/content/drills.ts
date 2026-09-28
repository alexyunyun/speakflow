import type { DrillPack, DrillGroup, DrillSentence } from '../lib/types'

// ============================================================
// 跟读句库 —— 参照 Cambridge (Interchange / English in Use) 与
// Oxford (English File / Headway) 教材体系组织:
//   功能句型(functional language)· 场景高频 · 职场专业 ·
//   母语味(习语/短语动词/连读)· 发音专项(易错音)
// ============================================================

export const DRILL_GROUP_LABEL: Record<DrillGroup, { zh: string; emoji: string }> = {
  function: { zh: '功能句型', emoji: '🧰' },
  scene: { zh: '场景高频', emoji: '🏙️' },
  work: { zh: '职场专业', emoji: '💼' },
  native: { zh: '母语味', emoji: '🗽' },
  pron: { zh: '发音专项', emoji: '🔊' }
}

let n = 0
const s = (en: string, zh: string, tip?: string): DrillSentence => ({ id: `s${++n}`, en, zh, tip })

export const DRILL_PACKS: DrillPack[] = [
  // ================= 功能句型 =================
  {
    id: 'clarify', group: 'function', emoji: '❓', title: 'Asking & Clarifying', zh: '提问与澄清',
    desc: '没听懂、想确认、打破砂锅问到底',
    sentences: [
      s('Could you say that again, please?', '能再说一遍吗?'),
      s("Sorry, I didn't quite catch that.", '抱歉,我没太听清。'),
      s('Could you speak a little more slowly?', '能说慢一点吗?'),
      s('What does this word mean?', '这个单词是什么意思?'),
      s('How do you spell that?', '怎么拼写?'),
      s('How do you say this in English?', '这个用英语怎么说?'),
      s('Do you mean we should start over?', '你是说我们应该重新开始?'),
      s("Let me make sure I've got this right.", '让我确认一下我理解得对不对。'),
      s('Could you give me an example?', '能举个例子吗?'),
      s("Sorry, could you repeat the last part?", '抱歉,能重复一下最后一部分吗?'),
      s("What's the difference between these two?", '这两个有什么区别?'),
      s('Is it correct to say it this way?', '这样说对吗?'),
      s('Just to clarify, the deadline is Friday?', '确认一下,截止日期是周五对吧?'),
      s("So you're saying that we should wait?", '所以你是说我们应该等?')
    ]
  },
  {
    id: 'request', group: 'function', emoji: '🙋', title: 'Requests & Offers', zh: '请求与帮助',
    desc: '开口求人不尴尬,主动帮忙显情商',
    sentences: [
      s('Could you do me a favor?', '能帮我个忙吗?'),
      s('Would you mind opening the window?', '你介意开下窗吗?'),
      s('Could I borrow your charger for a minute?', '能借你的充电器用一下吗?'),
      s('Is it okay if I come a bit later?', '我晚点到可以吗?'),
      s('Would it be possible to change the time?', '有可能换个时间吗?'),
      s('I was wondering if you could help me with this.', '不知道你能不能帮我一下。'),
      s('Do you need a hand with those boxes?', '需要帮你搬这些箱子吗?'),
      s('Let me know if there is anything I can do.', '有什么我能做的尽管说。'),
      s('Could you give me a hand in the kitchen?', '能去厨房搭把手吗?'),
      s('Any chance you could pick me up at seven?', '有可能七点来接我吗?'),
      s("I'd appreciate it if you could reply by today.", '如果你今天能回复,我将不胜感激。'),
      s('Never mind, I figured it out.', '不用了,我自己搞明白了。'),
      s('Thanks, that would be great!', '太好了,谢谢你!'),
      s('Sorry to trouble you, but the printer is jammed.', '不好意思打扰一下,打印机卡纸了。')
    ]
  },
  {
    id: 'opinion', group: 'function', emoji: '💭', title: 'Opinions & Reasons', zh: '观点与论证',
    desc: '有逻辑、有层次地表达看法',
    sentences: [
      s('In my opinion, it is worth a try.', '在我看来,值得一试。'),
      s('The way I see it, we have two options.', '依我看,我们有两个选择。'),
      s('From my perspective, the risk is too high.', '从我的角度看,风险太大了。'),
      s("I'd say it depends on the budget.", '我觉得这取决于预算。'),
      s('It seems to me that people are overreacting.', '在我看来,大家反应过度了。'),
      s('If you ask me, the first plan is better.', '要我说,第一个方案更好。'),
      s('As far as I am concerned, the deal is off.', '就我而言,这单生意黄了。'),
      s('The main reason is that the market changed.', '主要原因是市场变了。'),
      s('That is partly because of the weather.', '部分原因是天气。'),
      s('Take my hometown, for example.', '拿我的家乡举个例子。'),
      s('What I mean is we need more time.', '我的意思是我们需要更多时间。'),
      s('Let me put it another way.', '换个说法吧。'),
      s('There are two sides to this question.', '这个问题有两面性。'),
      s('The point I am trying to make is simple.', '我想说的其实很简单。'),
      s('To give you some context, we launched last year.', '先交代下背景:我们是去年上线的。'),
      s('My take on it is a bit different.', '我的看法稍微有点不一样。')
    ]
  },
  {
    id: 'agree', group: 'function', emoji: '🤝', title: 'Agreeing & Disagreeing', zh: '同意与反对',
    desc: '既能坚定立场,又不伤和气',
    sentences: [
      s("I couldn't agree more.", '我再同意不过了。'),
      s('That is exactly what I was thinking.', '我就是这么想的。'),
      s('You have a point there.', '你这点说得有道理。'),
      s('Fair enough, I can accept that.', '行吧,我可以接受。'),
      s('I see where you are coming from.', '我理解你的出发点。'),
      s('Absolutely, no doubt about it.', '必须的,毫无疑问。'),
      s("I'm with you on that one.", '这点我站你。'),
      s("I'm afraid I have to disagree.", '恐怕我不能同意。'),
      s("I'm not so sure about that.", '这个我不太确定。'),
      s('Hmm, I see it a bit differently.', '嗯,我的看法有点不同。'),
      s("That's not how I see it, to be honest.", '说实话,我不这么看。'),
      s('I get your point, but there is a catch.', '我懂你的意思,但有个问题。'),
      s('That may be true, however, the cost matters too.', '也许吧,但成本也很重要。'),
      s("Let's agree to disagree.", '我们各自保留意见吧。')
    ]
  },
  {
    id: 'suggest', group: 'function', emoji: '💡', title: 'Suggesting & Persuading', zh: '建议与说服',
    desc: '给建议不生硬,劝人于无形',
    sentences: [
      s('You should probably talk to her first.', '你也许应该先跟她聊聊。'),
      s("If I were you, I'd take the job.", '我要是你,就接受这份工作。'),
      s("Why don't we split the cost?", '我们分摊费用怎么样?'),
      s('Have you considered working remotely?', '你考虑过远程办公吗?'),
      s('It might be worth calling them directly.', '也许值得直接给他们打个电话。'),
      s("I'd suggest booking in advance.", '我建议提前预订。'),
      s('How about we meet halfway?', '我们各让一步怎么样?'),
      s('What if we tried a smaller version first?', '先做个小规模版本试试如何?'),
      s('It could be a good idea to double-check.', '再核对一遍可能是个好主意。'),
      s('The way I would do it is step by step.', '我会一步一步来。'),
      s('Trust me on this one.', '这次听我的,没错。'),
      s('The sooner, the better.', '越快越好。'),
      s("It's worth a shot, right?", '值得一试,对吧?'),
      s('You might want to bring a jacket.', '你也许该带件外套。')
    ]
  },
  {
    id: 'polite', group: 'function', emoji: '🎩', title: 'Polite & Tactful', zh: '礼貌与委婉',
    desc: '职场社交的软化剂,一开口就很得体',
    sentences: [
      s("I'm afraid that won't be possible.", '恐怕这办不到。'),
      s('I hate to say this, but we found some issues.', '我不想说这个,但我们发现了一些问题。'),
      s('Would it be too much trouble to resend the file?', '麻烦你再发一次文件,会不会太打扰?'),
      s('If it is not too much to ask, could you wait?', '如果不算过分的话,能等一下吗?'),
      s('I do not mean to be rude, but I disagree.', '我不是想冒犯,但我不同意。'),
      s('With all due respect, the data says otherwise.', '恕我直言,数据显示并非如此。'),
      s('Sorry to bother you again.', '不好意思又来打扰。'),
      s('Actually, I was hoping for a different answer.', '其实,我本来期待的是另一个答案。'),
      s('Sorry, I should have mentioned it earlier.', '抱歉,我应该早点说。'),
      s('Would you happen to know his schedule?', '你碰巧知道他的安排吗?'),
      s('I was wondering whether you had a minute.', '不知道你有没有一分钟时间。'),
      s('That is very kind of you, really.', '你真是太好了,真的。'),
      s('I really should not have, but thank you.', '我真不该收的,但还是谢谢。'),
      s('Would you be free by any chance tomorrow?', '你明天碰巧有空吗?')
    ]
  },
  {
    id: 'thanks', group: 'function', emoji: '🙏', title: 'Thanks & Apologies', zh: '感谢与道歉',
    desc: '真诚道谢、体面认错',
    sentences: [
      s('Thank you so much for your help.', '非常感谢你的帮助。'),
      s('I really appreciate it.', '真的很感激。'),
      s('That is very thoughtful of you.', '你想得真周到。'),
      s('I cannot thank you enough.', '我感激不尽。'),
      s('I owe you one.', '我欠你个人情。'),
      s('I am really sorry about the mix-up.', '真的很抱歉搞乱了。'),
      s('My apologies for the late reply.', '回复晚了,抱歉。'),
      s('It will not happen again, I promise.', '我保证不会再发生了。'),
      s('I did not mean to hurt your feelings.', '我不是有意伤害你的感情。'),
      s('No worries at all, it happens.', '完全没关系,常有的事。'),
      s('It is totally fine, do not worry.', '完全没问题,别担心。'),
      s('Do not mention it, happy to help.', '别客气,乐意帮忙。')
    ]
  },
  {
    id: 'refuse', group: 'function', emoji: '✋', title: 'Refusing & Setting Limits', zh: '拒绝与推辞',
    desc: '说不说不伤人,守住自己的边界',
    sentences: [
      s("I'm afraid I can't make it that day.", '恐怕那天我到不了。'),
      s("I'd love to, but I already have plans.", '我很想去,但我已经有安排了。'),
      s('Thanks for asking, but I will pass this time.', '谢谢你的邀请,这次我就不去了。'),
      s('Maybe some other time?', '要不改天?'),
      s('I will have to take a rain check.', '下次一定,先欠着。'),
      s('That is not going to work for me, sorry.', '那个时间我不行,抱歉。'),
      s('I am on a tight schedule today.', '我今天时间排得很满。'),
      s("I'd rather not, if that is okay.", '如果可以的话,我就不参加了。'),
      s('Let me check my calendar first.', '我先看看日程。'),
      s('That is a bit out of my depth.', '这有点超出我的能力范围。'),
      s('I have to draw a line somewhere.', '我总得有个底线。'),
      s('No thanks, I am good.', '不用了,谢谢,我真的不需要。')
    ]
  },
  {
    id: 'phone', group: 'function', emoji: '☎️', title: 'Phone & Messages', zh: '电话沟通',
    desc: '没有表情和画面的纯语音交流',
    sentences: [
      s('Hello, this is Chen calling about the apartment.', '你好,我是陈,关于公寓的事。'),
      s('Could I speak to the manager, please?', '能请经理接一下电话吗?'),
      s('May I ask who is calling?', '请问您是哪位?'),
      s('Could you put me through to sales?', '能帮我转接到销售部吗?'),
      s('Hold on a second, please.', '请稍等一下。'),
      s('Sorry, she is not available right now.', '抱歉,她现在不方便接听。'),
      s('Can I take a message?', '需要我带个话吗?'),
      s('Could you ask him to call me back?', '能让他给我回个电话吗?'),
      s('You are breaking up a little.', '你的信号有点断断续续。'),
      s('Let me read the number back to you.', '我把号码跟你核对一遍。'),
      s('Sorry, you must have the wrong number.', '抱歉,你大概打错电话了。'),
      s('Thanks for calling, talk soon.', '感谢来电,回头聊。')
    ]
  },

  // ================= 场景高频 =================
  {
    id: 'survival', group: 'scene', emoji: '🧭', title: 'Survival Essentials', zh: '生存必备',
    desc: '出国第一周就会用到的一切',
    sentences: [
      s('Where is the nearest subway station?', '最近的地铁站在哪?'),
      s('How much is this one?', '这个多少钱?'),
      s('Do you take credit cards?', '能刷信用卡吗?'),
      s("I'd like this to go, please.", '这个打包,谢谢。'),
      s('Could I have a receipt, please?', '能给我一张收据吗?'),
      s('Excuse me, is this seat taken?', '不好意思,这个座位有人吗?'),
      s('What time do you close?', '你们几点关门?'),
      s("I'm looking for the customer service desk.", '我在找客服柜台。'),
      s('Can you show me where it is on the map?', '能在地图上给我指一下吗?'),
      s('Is there a restroom around here?', '附近有洗手间吗?'),
      s("It was nice meeting you.", '很高兴认识你。'),
      s('Have a nice day!', '祝你有美好的一天!'),
      s('Thanks, you too!', '谢谢,你也是!'),
      s("I'm just looking, thanks.", '我只是随便看看,谢谢。'),
      s("That's all for today, thanks.", '今天就到这,谢谢。'),
      s('Keep the change.', '不用找了。')
    ]
  },
  {
    id: 'restaurant', group: 'scene', emoji: '🍽️', title: 'Dining & Table Talk', zh: '餐厅餐桌',
    desc: '从订位到买单的完整餐桌英语',
    sentences: [
      s('A table for two, please.', '麻烦,两位。'),
      s('Could we sit by the window?', '我们能坐窗边吗?'),
      s("What's today's special?", '今天的特色菜是什么?'),
      s("I'll have the steak, medium-rare, please.", '我要牛排,五分熟。'),
      s('Could I get that without onions?', '这道能不加洋葱吗?'),
      s('Could we get some more water, please?', '能再加点水吗?'),
      s('Everything is delicious, thanks.', '每道菜都很好吃,谢谢。'),
      s('Could we get the check, please?', '麻烦买单。'),
      s('Is service included in the bill?', '账单里含服务费吗?'),
      s("We'd like to split the bill.", '我们想分开付。'),
      s("I'm stuffed, I couldn't eat another bite.", '我撑死了,一口也吃不下了。'),
      s('Could I see the dessert menu?', '能看看甜品单吗?'),
      s('Two coffees to go, please.', '两杯咖啡,带走。'),
      s('Could you wrap this up for me?', '能帮我打包这个吗?')
    ]
  },
  {
    id: 'shopping', group: 'scene', emoji: '🛒', title: 'Shopping & Returns', zh: '购物消费',
    desc: '试穿、砍价、退换货一步到位',
    sentences: [
      s('Do you have this in a larger size?', '这个有大一号的吗?'),
      s('How much does it come to altogether?', '总共多少钱?'),
      s('Is this one on sale?', '这个在打折吗?'),
      s('Can I get a discount if I buy two?', '买两个能便宜点吗?'),
      s('What is your return policy?', '你们的退货政策是什么?'),
      s("I'd like to return this — here is the receipt.", '我想退掉这个,这是小票。'),
      s("It doesn't fit around the shoulders.", '肩膀这里不合身。'),
      s('Could I try these on?', '我能试穿一下吗?'),
      s("I'll take it.", '我要了。'),
      s('Can I pay by card?', '可以刷卡吗?'),
      s('Could you gift-wrap it?', '能帮忙礼品包装吗?'),
      s('Do you have a loyalty program?', '你们有会员积分计划吗?')
    ]
  },
  {
    id: 'transit', group: 'scene', emoji: '🚇', title: 'Transport & Transit', zh: '交通出行',
    desc: '坐车、转乘、赶飞机全流程',
    sentences: [
      s('One ticket to Central Station, please.', '一张去中央车站的票。'),
      s('Which platform does the train leave from?', '火车从几站台发车?'),
      s('Is this seat taken?', '这个座位有人吗?'),
      s('How long does it take to get there?', '到那儿要多久?'),
      s('Where do I change trains?', '我在哪里换乘?'),
      s('Could you tell me when we get to Main Street?', '到 Main Street 时能告诉我一声吗?'),
      s("I'd like to check in for the evening flight.", '我要办理晚班航班的值机。'),
      s('A window seat, please.', '麻烦靠窗的座位。'),
      s('Is the flight on time?', '航班准点吗?'),
      s('Where is the baggage claim?', '行李提取处在哪里?'),
      s("I've missed my connecting flight.", '我错过了中转航班。'),
      s('How do I get downtown from here?', '从这儿怎么去市中心?'),
      s('Does this bus go to the museum?', '这趟公交去博物馆吗?'),
      s('How far is the hotel from the airport?', '酒店离机场多远?')
    ]
  },
  {
    id: 'medical', group: 'scene', emoji: '🏥', title: 'Health & Medical', zh: '医疗健康',
    desc: '看病、买药、描述症状',
    sentences: [
      s("I'd like to make an appointment with a doctor.", '我想预约一位医生。'),
      s('I have been having headaches lately.', '我最近一直头疼。'),
      s('It hurts when I swallow.', '我吞咽的时候疼。'),
      s('The pain is right here.', '疼的地方就在这儿。'),
      s('How long has this been going on?', '这种情况持续多久了?'),
      s('Are you allergic to any medication?', '你对什么药物过敏吗?'),
      s("I'm here for a routine check-up.", '我来做常规体检。'),
      s('I need to get this prescription filled.', '我需要按这个处方拿药。'),
      s('Twice a day after meals, right?', '一天两次,饭后吃,对吗?'),
      s('Should I come back for a follow-up?', '需要回来复诊吗?'),
      s('I feel much better now, thanks.', '我现在感觉好多了,谢谢。'),
      s('Get well soon!', '早日康复!')
    ]
  },

  // ================= 职场专业 =================
  {
    id: 'meeting', group: 'work', emoji: '📋', title: 'Meetings & Updates', zh: '会议沟通',
    desc: '开场、汇报、打断、收尾全程掌控',
    sentences: [
      s("Let's get started, shall we?", '我们开始吧,如何?'),
      s('Could we move on to the next item?', '可以进入下一项吗?'),
      s('Just to update everyone, the launch went well.', '跟大家同步一下:发布会很顺利。'),
      s("I'd like to add something here.", '我想在这里补充一点。'),
      s('Sorry to interrupt, but time is tight.', '抱歉打断一下,时间比较紧。'),
      s('Could you elaborate on the second point?', '第二点能展开讲讲吗?'),
      s("What's the status on the client feedback?", '客户的反馈进展如何?'),
      s("We're running behind schedule.", '我们进度落后了。'),
      s("Let's circle back to this later.", '这个我们回头再谈。'),
      s('Can we align on the next steps?', '我们对一下接下来的安排吧。'),
      s("I'll take the minutes today.", '今天我来做会议记录。'),
      s("Let's table this for now.", '这个先搁置一下。'),
      s('Any strong objections before we proceed?', '继续之前,有人强烈反对吗?'),
      s("Let's wrap it up in five minutes.", '我们五分钟内收尾。')
    ]
  },
  {
    id: 'interview2', group: 'work', emoji: '🎯', title: 'Job Interviews', zh: '求职面试',
    desc: '高频面试题的标准打法',
    sentences: [
      s("I'm a good fit for this role for three reasons.", '我有三点理由证明我很适合这个职位。'),
      s('My strongest skill is data analysis.', '我最强的技能是数据分析。'),
      s('I thrive under pressure.', '我在压力下反而表现出色。'),
      s('I led a team of five engineers.', '我带领过一个五人工程师团队。'),
      s('We delivered the project two weeks early.', '我们提前两周交付了项目。'),
      s("I'm looking for new challenges.", '我在寻找新的挑战。'),
      s('What do you enjoy most about working here?', '你在这家公司工作最喜欢什么?'),
      s('Where do you see yourself in five years?', '五年后你希望自己是什么样子?'),
      s("What's your biggest weakness?", '你最大的缺点是什么?'),
      s('My salary expectation is around this range.', '我的薪资期望在这个区间。'),
      s('What does a typical day look like here?', '这里典型的一天是怎样的?'),
      s('What are the next steps in the process?', '流程的下一步是什么?'),
      s('I noticed your company recently expanded into Asia.', '我注意到贵公司最近拓展了亚洲市场。'),
      s('Thank you for your time today.', '感谢您今天抽出时间。')
    ]
  },
  {
    id: 'presentation', group: 'work', emoji: '📊', title: 'Presentations', zh: '演示汇报',
    desc: '结构化表达,控场自如',
    sentences: [
      s("Today I'm going to walk you through our plan.", '今天我将向大家介绍我们的方案。'),
      s('Let me start with a quick overview.', '先快速介绍一下概况。'),
      s("I've divided my talk into three parts.", '我把汇报分成三个部分。'),
      s('Moving on to the next slide.', '我们看下一页。'),
      s('As you can see here, the trend is clear.', '正如你在这里看到的,趋势很明显。'),
      s('This brings me to my next point.', '这就引出了我的下一点。'),
      s('To put it simply, the numbers do not lie.', '简单说,数字不会骗人。'),
      s('The key takeaway is customer trust.', '核心结论是客户信任。'),
      s('Does anyone have any questions?', '大家有什么问题吗?'),
      s("That's a great question.", '这个问题问得好。'),
      s("Let's look at the numbers in detail.", '我们详细看看这些数字。'),
      s('Thanks for your attention.', '感谢大家的聆听。')
    ]
  },
  {
    id: 'tech', group: 'work', emoji: '💻', title: 'Tech & Engineering', zh: '技术讨论',
    desc: '工程师的日常黑话与表达',
    sentences: [
      s('Can you reproduce the issue locally?', '你本地能复现这个问题吗?'),
      s('It works on my machine.', '在我机器上是好的(经典甩锅)。'),
      s("Let's take a step back and look at the design.", '我们退一步看看整体设计。'),
      s("What's the root cause of the failure?", '故障的根本原因是什么?'),
      s('We need to roll back the release.', '我们需要回滚这次发布。'),
      s("I'll open a pull request today.", '我今天会提一个 PR。'),
      s('Could you review my code when you have a minute?', '你有空时能帮我看看代码吗?'),
      s('This is a blocking issue for the launch.', '这是发布会的一个阻塞问题。'),
      s("Let's ship it behind a feature flag.", '我们用功能开关灰度发布吧。'),
      s('The hotfix is already deployed.', '热修复已经上线了。'),
      s("Let's not over-engineer this.", '我们别过度设计了。'),
      s("I'll write up a postmortem by Friday.", '周五前我会写一份复盘报告。')
    ]
  },
  {
    id: 'finance', group: 'work', emoji: '💹', title: 'Business & Finance', zh: '商务金融',
    desc: '财报、预算、商业决策的表达',
    sentences: [
      s('Revenue is up twelve percent year over year.', '营收同比增长了百分之十二。'),
      s('Our margins are getting squeezed.', '我们的利润空间被挤压了。'),
      s('We need to cut costs without losing quality.', '我们要降本,但不能牺牲质量。'),
      s('The forecast looks cautiously optimistic.', '预测是谨慎乐观的。'),
      s("What's the ROI on this campaign?", '这次营销活动的投资回报率是多少?'),
      s("We're over budget on marketing.", '我们市场费用超预算了。'),
      s('This quarter exceeded expectations.', '这个季度超出了预期。'),
      s('Our market share is shrinking slowly.', '我们的市场份额在慢慢缩小。'),
      s('The deal should close by next week.', '这单应该下周能签约。'),
      s('Cash flow is a bit tight this month.', '这个月现金流有点紧。'),
      s('We should diversify our revenue streams.', '我们应该让收入来源更多元。'),
      s('Let us run the numbers before deciding.', '做决定之前,我们先算算账。')
    ]
  },

  // ================= 母语味 =================
  {
    id: 'idioms', group: 'native', emoji: '🧩', title: 'Everyday Idioms', zh: '高频习语',
    desc: '母语者张口就来的固定表达',
    sentences: [
      s("It's not really my cup of tea.", '这不太合我的口味。'),
      s("Let's play it by ear.", '我们随机应变吧。'),
      s("I'm feeling a bit under the weather.", '我有点不舒服。'),
      s('It cost me an arm and a leg.', '这花了我一大笔钱。'),
      s('Once in a blue moon, we all meet up.', '我们难得聚一次。'),
      s('Long story short, we missed the flight.', '长话短说,我们误机了。'),
      s("Let's cross that bridge when we come to it.", '船到桥头自然直。'),
      s("Relax, it's a piece of cake.", '放松,小菜一碟。'),
      s("Don't beat around the bush.", '别拐弯抹角了。'),
      s('Who spilled the beans?', '谁走漏了风声?'),
      s("You're pulling my leg!", '你在逗我吧!'),
      s('Losing that job was a blessing in disguise.', '丢掉那份工作反而是因祸得福。'),
      s("We're on the same page now.", '我们现在想法一致了。'),
      s('If we both lower the price, it is a win-win.', '如果我们都降价,那就是双赢。'),
      s('You will do great — break a leg!', '你会表现很棒——祝你成功!'),
      s('You nailed it!', '你搞定了,漂亮!')
    ]
  },
  {
    id: 'phrasal', group: 'native', emoji: '🔗', title: 'Phrasal Verbs', zh: '短语动词',
    desc: 'get/take/put… 组合起来才是地道英语',
    sentences: [
      s('We ran out of milk this morning.', '我们家牛奶今天早上喝完了。'),
      s('The meeting was called off at the last minute.', '会议在最后一刻被取消了。'),
      s("I'm really looking forward to the trip.", '我非常期待这次旅行。'),
      s('She turned down the offer politely.', '她礼貌地拒绝了那个提议。'),
      s('Can you pick up the kids at five?', '五点能去接孩子吗?'),
      s('I need to look into this further.', '这件事我需要再查一查。'),
      s('I bumped into my old classmate today.', '我今天偶遇了老同学。'),
      s("Let's put off the decision until Monday.", '我们把决定推迟到周一吧。'),
      s('Our car broke down on the highway.', '我们的车在高速上抛锚了。'),
      s('I came across an old photo of us.', '我偶然翻到我们的一张老照片。'),
      s('Please fill out this form first.', '请先填一下这张表。'),
      s("We're running behind on the schedule.", '我们进度落后了。'),
      s("I'll get back to you tomorrow.", '我明天给你答复。'),
      s("Don't give up halfway.", '别半途而废。'),
      s('Could you turn it up a little?', '能调大一点声吗?'),
      s('Please put it down and listen.', '先放下手里的,听我说。')
    ]
  },
  {
    id: 'contractions', group: 'native', emoji: '🗣️', title: 'Connected Speech', zh: '连读与缩读',
    desc: 'gonna / wanna / gotta,听懂真实语速的关键',
    sentences: [
      s("I'm gonna grab a coffee.", '我去买杯咖啡。', "gonna = going to,口语中几乎不会读全称"),
      s('What do you wanna do tonight?', '今晚你想干什么?', 'wanna = want to'),
      s("I gotta run, see you tomorrow!", '我得走了,明天见!', "gotta = have got to"),
      s("Lemme know if you need anything.", '需要什么跟我说。', 'lemme = let me'),
      s('Gimme a second, please.', '稍等一下。', 'gimme = give me'),
      s("I'm kinda busy right now.", '我现在有点忙。', "kinda = kind of"),
      s('A lotta people agree with me.', '很多人都同意我。', "a lotta = a lot of"),
      s('I shoulda known better.', '我早该想到的。', 'shoulda = should have'),
      s('I woulda helped if I had known.', '早知道我就帮了。', 'woulda = would have'),
      s("I dunno what to say.", '我不知道说什么好。', "dunno = don't know"),
      s("C'mon, we're gonna be late!", '快点,我们要迟到了!', "c'mon = come on"),
      s('He is outta town this week.', '他这周不在城里。', 'outta = out of')
    ]
  },
  {
    id: 'chunks', group: 'native', emoji: '🧱', title: 'Discourse Chunks', zh: '高频语块',
    desc: '让对话自然流动的"口头胶水"',
    sentences: [
      s('Well, it depends.', '嗯,看情况。'),
      s('To be honest, I was surprised.', '说实话,我很惊讶。'),
      s('Actually, that reminds me of something.', '对了,这让我想起一件事。'),
      s('By the way, did you hear the news?', '顺便问一下,你听说那个消息了吗?'),
      s('Speaking of which, how is your brother?', '说到这个,你哥哥最近怎么样?'),
      s('Anyway, where was I?', '嗯……我刚说到哪了?'),
      s('So, long story short, we agreed.', '所以,长话短说,我们达成了共识。'),
      s('In the meantime, let us prepare the room.', '与此同时,我们把房间布置一下。'),
      s('On top of that, the price went up.', '除此之外,价格还涨了。'),
      s('That said, I still think it is worth it.', '话虽如此,我还是觉得值。'),
      s('All in all, it was a good trip.', '总的来说,这是一次不错的旅行。'),
      s('At the end of the day, it is your call.', '说到底,还是你说了算。'),
      s('Come to think of it, I have his number.', '这么一想,我有他的电话。'),
      s('You know what? Let us just go.', '要不这样?我们直接去吧。')
    ]
  },

  // ================= 发音专项 =================
  {
    id: 'th', group: 'pron', emoji: '👅', title: 'TH Sound /ð/ /θ/', zh: 'TH 咬舌音',
    desc: '中文没有的音:舌尖轻触上齿',
    sentences: [
      s('Think before you speak.', '三思而后行。', 'think /θɪŋk/:舌尖轻放在上下齿之间送气'),
      s('This is the third time this month.', '这是这个月第三次了。', 'this /ð/ 浊音,声带要振动'),
      s('Something is bothering me lately.', '最近有点心事。'),
      s('Thanks a thousand!', '万分感谢!'),
      s('Both of them thought so.', '他们俩都这么想。'),
      s('I have a toothache.', '我牙疼。'),
      s('Either this one or that one.', '要么这个,要么那个。'),
      s('My brother is rather wealthy.', '我哥哥相当有钱。'),
      s('It is worth the trouble.', '麻烦一点也值得。'),
      s('Thirty-three thirsty travelers.', '三十三位口渴的旅行者。', '经典绕口令,慢慢读准再加速')
    ]
  },
  {
    id: 'vw', group: 'pron', emoji: '👄', title: 'V vs W', zh: 'V / W 之分',
    desc: 'V 咬下唇,W 圆唇不咬唇',
    sentences: [
      s('We have a very interesting view.', '我们有一个很有意思的观点。', 'very /v/ 咬下唇,we /w/ 圆唇'),
      s('It was a wonderful evening.', '那是一个美好的夜晚。'),
      s('I love playing volleyball.', '我喜欢打排球。'),
      s('Wave your hand and wait for me.', '挥挥手,等等我。'),
      s('The van went west.', '面包车往西开了。', 'van /v/ 与 west /w/ 对比练习'),
      s('What a lovely view!', '多美的景色啊!'),
      s('Eleven veterans joined the event.', '十一位老兵参加了活动。'),
      s('Never venture into the woods alone.', '千万别独自进森林。'),
      s('The violin player over there is my cousin.', '那边拉小提琴的是我表哥。'),
      s('Vivian drove the van very well.', '薇薇安面包车开得很好。', '连续 v 开头,保持下唇轻触上齿')
    ]
  },
  {
    id: 'rl', group: 'pron', emoji: '🔁', title: 'R vs L', zh: 'R / L 之分',
    desc: 'R 卷舌不触腭,L 舌尖抵上齿龈',
    sentences: [
      s('The little red lorry rolled by.', '小红色卡车开过去了。', 'lorry:l 与 r 快速交替'),
      s('Really lovely weather today.', '今天天气真舒服。'),
      s("I'll arrive early to collect the tickets.", '我会早点到取票。'),
      s('The royal library is very old.', '皇家图书馆非常古老。', 'royal /r/ 与 loyal /l/ 只差一个音'),
      s('Please repeat after the leader.', '请跟着领读重复。'),
      s('It is a real relief to hear that.', '听到这个真是松了口气。'),
      s('The library closes at five.', '图书馆五点关门。', 'library 里 r 和 l 相邻,慢慢分开读清'),
      s('Rarely wrong, never late.', '很少出错,从不迟到。'),
      s('Collect the colored envelopes, please.', '请把彩色信封收起来。'),
      s('Lara rarely loses her keys.', '劳拉很少丢钥匙。')
    ]
  },
  {
    id: 'vowels', group: 'pron', emoji: '🎵', title: 'Long vs Short Vowels', zh: '长短元音',
    desc: 'ship/sheep、full/fool,一音之差意思全变',
    sentences: [
      s('The ship leaves at six.', '船六点出发。', 'ship /ɪ/ 短促,sheep /iː/ 拉长'),
      s('He will live here for weeks.', '他将在这里住几周。'),
      s('The cook looked at the menu.', '厨师看了看菜单。', 'cook/look /ʊ/ 短,不要读成 "酷"'),
      s('Pull the tool out of the pool.', '把工具从池子里拿出来。', 'pull 短音,tool/pool 长音'),
      s('I walk to work every day.', '我每天走路上班。', 'walk /ɔː/ 圆唇,work /ɜː/ 不圆唇'),
      s('There is a pen in the pan.', '平底锅里有支笔。', 'pen /e/ 与 pan /æ/ 口型一大一小'),
      s('The man said ten red pens.', '那个人说了十支红笔。'),
      s('That fool filled the whole cup.', '那个傻瓜把杯子倒满了。', 'fill /ɪ/ 与 fool /uː/ 区分'),
      s('Sit in this seat, please.', '请坐这个座位。', 'sit 短,seat 长且嘴角更开'),
      s('The cat cut the cloth by mistake.', '猫误把布抓破了。', 'cat /æ/ 大开口,cut /ʌ/ 中央元音')
    ]
  },
  {
    id: 'endings', group: 'pron', emoji: '🪝', title: 'Word Endings', zh: '词尾辅音',
    desc: '-ed / -s / 尾音,中文母语者最易吞掉',
    sentences: [
      s('I asked for a day off.', '我请了一天假。', 'asked /æskt/ 尾音 t 要轻弹出来'),
      s('She laughed at my joke.', '她被我的笑话逗笑了。', 'laughed 读 /læft/,不是 "拉夫德"'),
      s('He stopped at the gate.', '他在大门口停下了。', 'stopped /stɒpt/'),
      s('We watched a movie last night.', '我们昨晚看了部电影。', 'watched /wɒtʃt/'),
      s('They baked fresh bread.', '他们烤了新鲜面包。', 'baked /beɪkt/'),
      s('I passed the exam.', '我通过了考试。', 'passed /pɑːst/ 尾音 s 不要吞'),
      s('She fixed the car in an hour.', '她一小时修好了车。', 'fixed /fɪkst/ 三个尾音连读'),
      s('He grabbed his bag and left.', '他抓起包就走了。', 'grabbed /ɡræbd/ 浊音 d'),
      s('They hiked and biked all day.', '他们徒步骑行了一整天。'),
      s('We landed safely at midnight.', '我们午夜安全着陆。', 'landed /ˈlændɪd/ 别读成 "蓝-德"')
    ]
  }
]

export const totalDrillSentences = DRILL_PACKS.reduce((a, p) => a + p.sentences.length, 0)
