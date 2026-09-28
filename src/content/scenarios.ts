import type { Scenario } from '../lib/types'

// ===== 场景库:日常生活 / 旅行出行 / 职场专业 / 观点讨论 =====
// persona 为英文角色设定,与 coach.ts 的通用规则拼成完整 system prompt。

export const GROUPS: { id: Scenario['group']; zh: string; en: string }[] = [
  { id: 'talk', zh: '自由讨论', en: 'Free Talk' },
  { id: 'daily', zh: '日常生活', en: 'Daily Life' },
  { id: 'travel', zh: '旅行出行', en: 'Travel' },
  { id: 'work', zh: '职场专业', en: 'Work' }
]

const S = (s: Scenario) => s

export const SCENARIOS: Scenario[] = [
  // ---------- 自由讨论 ----------
  S({
    id: 'free', emoji: '💬', group: 'talk', title: 'Free Talk', zh: '自由聊天', level: 'A2',
    desc: '不限话题,想到哪聊到哪',
    persona: 'You are a friendly, curious English-speaking friend named Alex. You love asking questions and sharing little stories about everyday life.',
    opener: "Hey, good to see you! How's your day going so far?",
    phrases: [
      { en: "What's up? How have you been?", zh: '最近怎么样?' },
      { en: "That reminds me of…", zh: '这让我想起……' },
      { en: "Speaking of which…", zh: '说到这个……' },
      { en: "I was wondering if…", zh: '我想知道……' },
      { en: "Tell me more about it!", zh: '跟我多讲讲!' }
    ],
    vocab: [
      { en: 'catch up', zh: '叙旧;了解近况' },
      { en: 'hang out', zh: '闲逛;一起玩' },
      { en: 'no way', zh: '不会吧(表惊讶)' },
      { en: 'kind of / sort of', zh: '有点儿' },
      { en: 'to be honest', zh: '说实话' },
      { en: 'it depends', zh: '看情况' },
      { en: 'you know what I mean', zh: '你懂我意思吧' },
      { en: 'that makes sense', zh: '有道理' }
    ]
  }),
  S({
    id: 'hobbies', emoji: '🎨', group: 'talk', title: 'Hobbies & Weekends', zh: '兴趣与周末', level: 'A2',
    desc: '聊聊爱好、周末安排和放松方式',
    persona: 'You are a laid-back friend who is passionate about photography, hiking and cooking. You swap weekend plans and hobbies with the learner.',
    opener: "So the weekend's coming up — got anything fun planned?",
    phrases: [
      { en: 'What do you do in your free time?', zh: '你空闲时做什么?' },
      { en: "I'm really into…", zh: '我特别喜欢……' },
      { en: 'I like to unwind by…', zh: '我喜欢靠……放松' },
      { en: "I've been meaning to try…", zh: '我一直想试试……' },
      { en: 'Count me in!', zh: '算我一个!' }
    ],
    vocab: [
      { en: 'hobby', zh: '爱好' },
      { en: 'be into sth', zh: '热衷于某事' },
      { en: 'unwind', zh: '放松' },
      { en: 'productive', zh: '高效的;有成果的' },
      { en: 'sleep in', zh: '睡懒觉' },
      { en: 'run errands', zh: '处理杂事' },
      { en: 'pastime', zh: '消遣' },
      { en: 'addicted to', zh: '上瘾;着迷' }
    ]
  }),
  S({
    id: 'movies', emoji: '🎬', group: 'talk', title: 'Movies, Music & Books', zh: '影音书籍', level: 'B1',
    desc: '聊电影、音乐、播客和书,交换推荐',
    persona: 'You are a film and music enthusiast who always asks for recommendations and shares hot takes about recent releases.',
    opener: "I just watched an amazing movie last night — do you watch much, or are you more of a book person?",
    phrases: [
      { en: 'Have you seen/heard…? It’s a must-watch.', zh: '你看过/听过……吗?必看!' },
      { en: "It's not really my cup of tea.", zh: '这不是我的菜。' },
      { en: 'The plot twist caught me off guard.', zh: '反转让我措手不及。' },
      { en: 'I’d give it a thumbs-up.', zh: '我会点个赞。' },
      { en: 'Any recommendations?', zh: '有什么推荐吗?' }
    ],
    vocab: [
      { en: 'spoiler', zh: '剧透' },
      { en: 'plot twist', zh: '剧情反转' },
      { en: 'blockbuster', zh: '大片' },
      { en: 'soundtrack', zh: '原声带' },
      { en: 'on repeat', zh: '单曲循环' },
      { en: 'page-turner', zh: '让人停不下来的书' },
      { en: 'critically acclaimed', zh: '广受好评的' },
      { en: 'overrated', zh: '被高估的' }
    ]
  }),
  S({
    id: 'foodie', emoji: '🍜', group: 'talk', title: 'Food & Local Eats', zh: '美食文化', level: 'B1',
    desc: '聊餐馆、菜系、烹饪和家乡味道',
    persona: 'You are a foodie friend who loves exploring new restaurants and comparing street food around the world. You ask about the learner’s hometown food.',
    opener: "Okay, important question — if I visited your hometown, what's the one dish I absolutely have to try?",
    phrases: [
      { en: 'I have a sweet tooth.', zh: '我爱吃甜食。' },
      { en: 'It melts in your mouth.', zh: '入口即化。' },
      { en: "It's a bit too greasy for me.", zh: '对我来说有点太油腻。' },
      { en: 'You have to try it at least once.', zh: '你至少得试一次。' },
      { en: 'I’m starving — let’s grab a bite.', zh: '我饿死了,去吃点东西吧。' }
    ],
    vocab: [
      { en: 'cuisine', zh: '菜系;烹饪风格' },
      { en: 'appetizing', zh: '开胃的;诱人的' },
      { en: 'street food', zh: '街头小吃' },
      { en: 'spicy / mild', zh: '辣的 / 清淡的' },
      { en: 'portion', zh: '分量' },
      { en: 'leftovers', zh: '剩菜;打包' },
      { en: 'comfort food', zh: '治愈系食物' },
      { en: 'food stall', zh: '小吃摊' }
    ]
  }),
  S({
    id: 'travel-story', emoji: '🌏', group: 'talk', title: 'Travel Stories', zh: '旅行见闻', level: 'B1',
    desc: '分享难忘的旅行经历和文化差异',
    persona: 'You are a well-traveled friend who swaps stories about memorable trips, funny mishaps and cultural surprises.',
    opener: "I keep thinking about a trip I took years ago — what's the most memorable trip you've ever been on?",
    phrases: [
      { en: 'It was a once-in-a-lifetime experience.', zh: '那是一生一次的体验。' },
      { en: 'We wandered around the old town.', zh: '我们在老城里闲逛。' },
      { en: 'It was totally worth the trip.', zh: '这趟太值了。' },
      { en: 'I got lost, but that was part of the fun.', zh: '我迷路了,但那也是乐趣之一。' },
      { en: "It's off the beaten path.", zh: '那是个小众去处。' }
    ],
    vocab: [
      { en: 'itinerary', zh: '行程' },
      { en: 'sightseeing', zh: '观光' },
      { en: 'breathtaking', zh: '令人惊叹的' },
      { en: 'jet lag', zh: '时差' },
      { en: 'souvenir', zh: '纪念品' },
      { en: 'get around', zh: '出行;四处走动' },
      { en: 'culture shock', zh: '文化冲击' },
      { en: 'hidden gem', zh: '宝藏去处' }
    ]
  }),
  S({
    id: 'ai', emoji: '🤖', group: 'talk', title: 'Technology & AI Trends', zh: '科技与 AI', level: 'B2',
    desc: '聊 AI、数码产品和科技如何改变生活',
    persona: 'You are a tech-savvy product manager who loves debating where AI is heading and how tech shapes daily life. You ask for the learner’s real opinions.',
    opener: "Everyone's talking about AI these days — has it actually changed how you work or study yet?",
    phrases: [
      { en: 'It’s a double-edged sword.', zh: '这是把双刃剑。' },
      { en: 'I think we’re still in the early stages.', zh: '我觉得还处于早期阶段。' },
      { en: 'It might replace some jobs, but it creates new ones too.', zh: '它会取代一些工作,但也创造新的。' },
      { en: 'I’m a bit skeptical about that.', zh: '对此我有点怀疑。' },
      { en: 'Time will tell.', zh: '时间会证明一切。' }
    ],
    vocab: [
      { en: 'artificial intelligence', zh: '人工智能' },
      { en: 'algorithm', zh: '算法' },
      { en: 'automation', zh: '自动化' },
      { en: 'breakthrough', zh: '突破' },
      { en: 'cutting-edge', zh: '前沿的' },
      { en: 'privacy concerns', zh: '隐私问题' },
      { en: 'disrupt', zh: '颠覆' },
      { en: 'ethical implications', zh: '伦理影响' }
    ]
  }),
  S({
    id: 'news', emoji: '📰', group: 'talk', title: 'News & Current Events', zh: '新闻时事', level: 'B2',
    desc: '讨论近期新闻,练习表达观点和让步',
    persona: 'You are a journalist friend who brings up a recent news story and asks the learner to weigh in, playing devil’s advocate now and then.',
    opener: "Did you catch the news this week? There's one story I can't stop thinking about — do you follow current events much?",
    phrases: [
      { en: 'From what I’ve read…', zh: '据我所看到的……' },
      { en: 'I see your point, but…', zh: '我明白你的意思,但是……' },
      { en: 'That’s partly true, yet…', zh: '那部分是对的,然而……' },
      { en: 'It made headlines.', zh: '这上了头条。' },
      { en: 'I take that with a grain of salt.', zh: '我对这个持保留态度。' }
    ],
    vocab: [
      { en: 'current affairs', zh: '时事' },
      { en: 'headline', zh: '头条;标题' },
      { en: 'source', zh: '消息来源' },
      { en: 'controversial', zh: '有争议的' },
      { en: 'public opinion', zh: '舆论' },
      { en: 'coverage', zh: '报道(量)' },
      { en: 'bias', zh: '偏见' },
      { en: 'on the rise', zh: '在上升;增多' }
    ]
  }),
  S({
    id: 'debate', emoji: '⚖️', group: 'talk', title: 'Debate: Big Questions', zh: '观点辩论', level: 'C1',
    desc: '远程办公、环保等议题,练习有逻辑地说理',
    persona: 'You are a sharp but friendly debate partner. You pick big questions (remote work, environmental policy, social media, education) and challenge the learner’s reasoning respectfully, asking “why” and offering counterarguments.',
    opener: "Let's settle a classic debate: working from home — productivity booster or career killer? Which side are you on?",
    phrases: [
      { en: 'Let me play devil’s advocate here.', zh: '让我来唱唱反调。' },
      { en: 'The evidence suggests otherwise.', zh: '证据表明并非如此。' },
      { en: 'That’s a fair point, but consider…', zh: '有道理,但想想……' },
      { en: 'At the end of the day…', zh: '说到底……' },
      { en: 'I’d push back on that a little.', zh: '这点我想反驳一下。' }
    ],
    vocab: [
      { en: 'argument', zh: '论点' },
      { en: 'counterargument', zh: '反驳' },
      { en: 'trade-off', zh: '权衡取舍' },
      { en: 'sustainable', zh: '可持续的' },
      { en: 'in the long run', zh: '从长远来看' },
      { en: 'compelling', zh: '有说服力的' },
      { en: 'drawback', zh: '缺点' },
      { en: 'concede', zh: '承认(对方观点)' }
    ]
  }),

  // ---------- 日常生活 ----------
  S({
    id: 'cafe', emoji: '☕', group: 'daily', title: 'At the Coffee Shop', zh: '咖啡馆点单', level: 'B1',
    desc: '点咖啡、改单、要发票等真实点单流程',
    persona: 'You are a friendly barista at a busy specialty coffee shop. You take the order, suggest drinks, ask for the name, and make small talk about the weather while the drink is prepared.',
    opener: 'Hi there! What can I get started for you today?',
    phrases: [
      { en: 'I’ll have a medium latte, please.', zh: '我要一杯中杯拿铁。' },
      { en: 'Could I get that with oat milk?', zh: '能换成燕麦奶吗?' },
      { en: 'For here or to go?', zh: '堂食还是外带?' },
      { en: 'Can I get a receipt?', zh: '能给我一张小票吗?' },
      { en: 'Actually, could I change my order?', zh: '等等,我想改下单。' }
    ],
    vocab: [
      { en: 'espresso', zh: '浓缩咖啡' },
      { en: 'brew', zh: '冲煮' },
      { en: 'decaf', zh: '低咖啡因' },
      { en: 'whipped cream', zh: '打发奶油' },
      { en: 'pastry', zh: '糕点' },
      { en: 'a splash of milk', zh: '一点牛奶' },
      { en: 'loyalty card', zh: '集点卡' },
      { en: 'refill', zh: '续杯' }
    ]
  }),
  S({
    id: 'restaurant', emoji: '🍽️', group: 'daily', title: 'Ordering at a Restaurant', zh: '餐厅点餐', level: 'B1',
    desc: '订位、点餐、问菜、买单全程',
    persona: 'You are a server at a popular bistro. You greet the learner, recommend dishes, ask about allergies, check on the table, and bring the bill.',
    opener: 'Good evening! Welcome in — table for one? Right this way. Can I start you off with something to drink?',
    phrases: [
      { en: 'Could I see the menu, please?', zh: '能给我看看菜单吗?' },
      { en: 'What do you recommend?', zh: '你推荐什么?' },
      { en: 'I’m allergic to peanuts.', zh: '我对花生过敏。' },
      { en: 'Could we get the check, please?', zh: '麻烦买单。' },
      { en: 'Everything was delicious, thank you.', zh: '都很好吃,谢谢。' }
    ],
    vocab: [
      { en: 'appetizer', zh: '前菜' },
      { en: 'main course', zh: '主菜' },
      { en: 'medium-rare', zh: '五分熟(牛排)' },
      { en: 'side dish', zh: '配菜' },
      { en: 'to-go box', zh: '打包盒' },
      { en: 'the special', zh: '今日特色菜' },
      { en: 'tip', zh: '小费' },
      { en: 'dietary restrictions', zh: '饮食限制' }
    ]
  }),
  S({
    id: 'smalltalk', emoji: '☀️', group: 'daily', title: 'Small Talk & Weather', zh: '寒暄闲聊', level: 'A2',
    desc: '和陌生人打开话匣子:天气、周末、近况',
    persona: 'You are a chatty neighbor you bump into at the bus stop. You start with the weather and move naturally to weekend plans and light topics.',
    opener: 'Lovely day today, isn’t it? I heard it might rain tomorrow though.',
    phrases: [
      { en: 'Lovely weather, isn’t it?', zh: '天气真好,是吧?' },
      { en: 'How was your weekend?', zh: '周末过得怎么样?' },
      { en: 'Any plans for the holidays?', zh: '假期有什么安排?' },
      { en: 'It’s been a while!', zh: '好久不见!' },
      { en: 'Well, I should get going.', zh: '那我先走了。' }
    ],
    vocab: [
      { en: 'chilly', zh: '微冷的' },
      { en: 'humid', zh: '潮湿闷热' },
      { en: 'drizzle', zh: '毛毛雨' },
      { en: 'forecast', zh: '天气预报' },
      { en: 'small talk', zh: '寒暄;闲聊' },
      { en: 'bump into', zh: '偶遇' },
      { en: 'catch you later', zh: '回头见' },
      { en: 'so-so', zh: '还行,一般般' }
    ]
  }),
  S({
    id: 'shopping', emoji: '🛍️', group: 'daily', title: 'Shopping & Returns', zh: '购物与退货', level: 'B1',
    desc: '试穿、询价、退换货全过程',
    persona: 'You are a helpful shop assistant in a clothing store, then handle a return at the counter. You ask about size, offer alternatives and explain the return policy.',
    opener: 'Hi! Let me know if you need a hand — we just got new stock in. Are you looking for anything in particular?',
    phrases: [
      { en: 'Do you have this in a medium?', zh: '这件有中码吗?' },
      { en: 'Can I try it on? Where’s the fitting room?', zh: '能试穿吗?试衣间在哪?' },
      { en: 'It’s a bit tight around the shoulders.', zh: '肩膀这里有点紧。' },
      { en: 'I’d like to return this — here’s the receipt.', zh: '我想退掉这个,这是小票。' },
      { en: 'Can I get a refund or store credit?', zh: '能退款或者换 store credit 吗?' }
    ],
    vocab: [
      { en: 'fitting room', zh: '试衣间' },
      { en: 'on sale', zh: '打折中' },
      { en: 'refund', zh: '退款' },
      { en: 'exchange', zh: '换货' },
      { en: 'receipt', zh: '收据' },
      { en: 'out of stock', zh: '缺货' },
      { en: 'try it on', zh: '试穿' },
      { en: 'it suits you', zh: '很衬你' }
    ]
  }),
  S({
    id: 'doctor', emoji: '🩺', group: 'daily', title: 'Seeing the Doctor', zh: '看医生', level: 'B1',
    desc: '描述症状、问诊、拿处方',
    persona: 'You are a kind family doctor. You ask about symptoms, how long they’ve lasted, allergies and medications, then explain the diagnosis and prescription simply.',
    opener: 'Come in and have a seat. So, what seems to be the problem today?',
    phrases: [
      { en: 'I’ve had a sore throat for three days.', zh: '我嗓子疼三天了。' },
      { en: 'It hurts when I swallow.', zh: '吞咽时疼。' },
      { en: 'Do I need any tests?', zh: '需要做什么检查吗?' },
      { en: 'How often should I take this?', zh: '这个多久吃一次?' },
      { en: 'Are there any side effects?', zh: '有副作用吗?' }
    ],
    vocab: [
      { en: 'symptom', zh: '症状' },
      { en: 'fever', zh: '发烧' },
      { en: 'cough / sneeze', zh: '咳嗽 / 打喷嚏' },
      { en: 'prescription', zh: '处方' },
      { en: 'dosage', zh: '剂量' },
      { en: 'side effects', zh: '副作用' },
      { en: 'appointment', zh: '预约' },
      { en: 'recover', zh: '康复' }
    ]
  }),
  S({
    id: 'gym', emoji: '🏋️', group: 'daily', title: 'At the Gym', zh: '健身房', level: 'B1',
    desc: '办卡、约课、器械使用与训练计划',
    persona: 'You are a gym membership advisor and part-time trainer. You show the learner around, explain plans and classes, and give beginner tips.',
    opener: 'Welcome! Thinking about joining? Let me show you around — free weights are over there, and we’ve got classes every evening.',
    phrases: [
      { en: 'How much is the monthly membership?', zh: '月卡多少钱?' },
      { en: 'Do you offer personal training?', zh: '有私教课吗?' },
      { en: 'Could you show me how to use this machine?', zh: '能教我怎么用这台器械吗?' },
      { en: 'I’d like to book a class.', zh: '我想约一节课。' },
      { en: 'Can I freeze my membership?', zh: '会员卡能冻结吗?' }
    ],
    vocab: [
      { en: 'membership', zh: '会员' },
      { en: 'warm-up', zh: '热身' },
      { en: 'reps / sets', zh: '次数 / 组数' },
      { en: 'treadmill', zh: '跑步机' },
      { en: 'stretch', zh: '拉伸' },
      { en: 'personal trainer', zh: '私教' },
      { en: 'work out', zh: '锻炼' },
      { en: 'get in shape', zh: '塑形;练出好身材' }
    ]
  }),
  S({
    id: 'salon', emoji: '💇', group: 'daily', title: 'Hair Salon & Appointments', zh: '理发与预约', level: 'B1',
    desc: '预约、描述发型需求、砍价与办卡',
    persona: 'You are a stylist at a hair salon. You take a booking call first, then consult on the haircut: length, style, color — and suggest what suits the learner.',
    opener: 'Thanks for coming in! What are we doing today — just a trim, or something completely new?',
    phrases: [
      { en: 'I’d like to book a haircut for tomorrow.', zh: '我想约明天剪发。' },
      { en: 'Just a trim, please — about two centimeters.', zh: '只修一下,剪短两厘米左右。' },
      { en: 'Could you thin it out a bit?', zh: '能帮我打薄一点吗?' },
      { en: 'I want to dye it a shade darker.', zh: '我想染深一个色号。' },
      { en: 'How long will that take?', zh: '那要多久?' }
    ],
    vocab: [
      { en: 'trim', zh: '修剪' },
      { en: 'bangs / fringe', zh: '刘海' },
      { en: 'dye', zh: '染发' },
      { en: 'highlight', zh: '挑染' },
      { en: 'shave', zh: '刮;剃' },
      { en: 'stylist', zh: '发型师' },
      { en: 'layered', zh: '有层次的' },
      { en: 'touch up', zh: '补染;修补' }
    ]
  }),
  S({
    id: 'neighbors', emoji: '🏡', group: 'daily', title: 'Chatting with Neighbors', zh: '邻里交流', level: 'A2',
    desc: '新搬来打招呼、请邻居帮忙、处理小摩擦',
    persona: 'You are a warm longtime resident of the apartment building. You welcome the learner, offer tips about the area, and mention a small noise complaint tactfully.',
    opener: 'Oh hi! You must be the new neighbor — welcome to the building! I’m in 4B if you ever need anything.',
    phrases: [
      { en: 'I just moved in last week.', zh: '我上周刚搬来。' },
      { en: 'Is there a good supermarket nearby?', zh: '附近有好超市吗?' },
      { en: 'Sorry to bother you, but…', zh: '不好意思打扰一下……' },
      { en: 'Could you keep an eye on my place while I’m away?', zh: '我不在时能帮我照看下家吗?' },
      { en: 'Let me know if I’m ever too loud.', zh: '如果我太吵请告诉我。' }
    ],
    vocab: [
      { en: 'move in', zh: '搬入' },
      { en: 'tenant', zh: '租客' },
      { en: 'landlord', zh: '房东' },
      { en: 'laundry room', zh: '洗衣房' },
      { en: 'garbage disposal', zh: '垃圾处理' },
      { en: 'housewarming', zh: '乔迁宴' },
      { en: 'keep an eye on', zh: '照看;留意' },
      { en: 'get along', zh: '相处融洽' }
    ]
  }),
  S({
    id: 'tech', emoji: '📶', group: 'daily', title: 'Tech Support Call', zh: '设备故障求助', level: 'B2',
    desc: '描述设备故障、跟客服来回排查',
    persona: 'You are a patient but process-driven tech support agent. The learner’s Wi-Fi keeps dropping. Walk through standard troubleshooting steps, ask clarifying questions, and eventually escalate to a technician visit.',
    opener: 'Thanks for calling support, this is Sam. I understand you’re having some trouble — can you describe what’s happening?',
    phrases: [
      { en: 'My Wi-Fi keeps disconnecting every few minutes.', zh: 'Wi-Fi 每隔几分钟就断。' },
      { en: 'I’ve already tried restarting the router.', zh: '我已经试过重启路由器了。' },
      { en: 'It works fine on my phone, just not the laptop.', zh: '手机上正常,只有笔记本不行。' },
      { en: 'Could you walk me through it step by step?', zh: '能一步一步教我吗?' },
      { en: 'Can someone come and take a look?', zh: '能派人来看看吗?' }
    ],
    vocab: [
      { en: 'router', zh: '路由器' },
      { en: 'reboot / restart', zh: '重启' },
      { en: 'signal', zh: '信号' },
      { en: 'plug in', zh: '插上电源' },
      { en: 'glitch', zh: '小故障' },
      { en: 'warranty', zh: '保修' },
      { en: 'back up', zh: '备份' },
      { en: 'default settings', zh: '默认设置' }
    ]
  }),
  S({
    id: 'phone', emoji: '☎️', group: 'daily', title: 'Phone Calls & Appointments', zh: '电话与预约', level: 'B2',
    desc: '没有画面辅助的电话沟通:预约改期、留言',
    persona: 'You are a receptionist at a dental clinic taking phone calls. Handle a booking, a reschedule request, and taking a message for the doctor.',
    opener: 'Good morning, Bright Smile Dental, this is Lisa speaking. How can I help you today?',
    phrases: [
      { en: 'I’d like to make an appointment.', zh: '我想预约。' },
      { en: 'Could I reschedule to next week?', zh: '能改到下周吗?' },
      { en: 'Could you put me through to…?', zh: '能帮我转接……吗?' },
      { en: 'Can I leave a message?', zh: '我能留个言吗?' },
      { en: 'Sorry, could you repeat that?', zh: '抱歉,能重复一遍吗?' }
    ],
    vocab: [
      { en: 'put you through', zh: '为您转接' },
      { en: 'hold the line', zh: '别挂断' },
      { en: 'call back', zh: '回电' },
      { en: 'available slot', zh: '可约的时段' },
      { en: 'confirm', zh: '确认' },
      { en: 'cancel', zh: '取消' },
      { en: 'message', zh: '留言' },
      { en: 'on hold', zh: '等待接听中' }
    ]
  }),

  // ---------- 旅行出行 ----------
  S({
    id: 'airport', emoji: '✈️', group: 'travel', title: 'Airport: Check-in & Security', zh: '机场值机安检', level: 'B1',
    desc: '值机、选座、托运、过安检对话',
    persona: 'You are a check-in agent at a busy international airport. Handle bag drop, seat preference, a slight overweight-bag issue, and give boarding information.',
    opener: 'Good afternoon! May I see your passport and booking reference, please?',
    phrases: [
      { en: 'I’d like a window seat, please.', zh: '我想要靠窗的座位。' },
      { en: 'Can I take this as carry-on?', zh: '这个能带上飞机吗?' },
      { en: 'Is the flight on time?', zh: '航班准点吗?' },
      { en: 'Which gate is boarding from?', zh: '在哪个登机口登机?' },
      { en: 'I have nothing to declare.', zh: '我没有需要申报的物品。' }
    ],
    vocab: [
      { en: 'check-in', zh: '值机' },
      { en: 'boarding pass', zh: '登机牌' },
      { en: 'carry-on', zh: '随身行李' },
      { en: 'luggage claim', zh: '行李提取处' },
      { en: 'layover', zh: '中转停留' },
      { en: 'delayed', zh: '延误的' },
      { en: 'aisle seat', zh: '靠过道座位' },
      { en: 'security check', zh: '安检' }
    ]
  }),
  S({
    id: 'hotel', emoji: '🏨', group: 'travel', title: 'Hotel Check-in & Requests', zh: '酒店入住', level: 'B1',
    desc: '入住、要 towels、Wi-Fi 问题、退房',
    persona: 'You are a front-desk receptionist at a hotel. Check the learner in, handle a room change request (noisy street side), explain breakfast hours, and later process checkout.',
    opener: 'Welcome to the Grand Bay Hotel! Do you have a reservation with us?',
    phrases: [
      { en: 'I have a reservation under the name Chen.', zh: '我用 Chen 的名字订了房。' },
      { en: 'What time is checkout?', zh: '退房时间是几点?' },
      { en: 'The Wi-Fi isn’t working in my room.', zh: '房间里 Wi-Fi 连不上。' },
      { en: 'Could I get extra towels, please?', zh: '能多送几条毛巾吗?' },
      { en: 'Could you keep my luggage for a while?', zh: '能寄存一下行李吗?' }
    ],
    vocab: [
      { en: 'reservation', zh: '预订' },
      { en: 'front desk', zh: '前台' },
      { en: 'check in / out', zh: '入住 / 退房' },
      { en: 'housekeeping', zh: '客房服务' },
      { en: 'deposit', zh: '押金' },
      { en: 'twin room', zh: '双床房' },
      { en: 'concierge', zh: '礼宾部' },
      { en: 'amenities', zh: '设施;用品' }
    ]
  }),
  S({
    id: 'directions', emoji: '🗺️', group: 'travel', title: 'Asking for Directions', zh: '问路和交通', level: 'A2',
    desc: '问路、坐地铁公交、买票',
    persona: 'You are a friendly local at a bus stop. Give clear directions with landmarks, and suggest the best way to get downtown.',
    opener: 'You look a little lost — do you need help finding something?',
    phrases: [
      { en: 'Excuse me, how do I get to the museum?', zh: '请问博物馆怎么走?' },
      { en: 'Is it within walking distance?', zh: '走路能到吗?' },
      { en: 'Which line should I take?', zh: '我该坐哪条线?' },
      { en: 'Where do I get off?', zh: '我该在哪站下?' },
      { en: 'Could you show me on the map?', zh: '能在地图上指给我看吗?' }
    ],
    vocab: [
      { en: 'intersection', zh: '十字路口' },
      { en: 'crosswalk', zh: '人行横道' },
      { en: 'go straight', zh: '直走' },
      { en: 'turn left / right', zh: '左转 / 右转' },
      { en: 'next to / across from', zh: '在旁边 / 在对面' },
      { en: 'block', zh: '街区' },
      { en: 'one-way street', zh: '单行道' },
      { en: 'fare', zh: '车费' }
    ]
  }),
  S({
    id: 'taxi', emoji: '🚕', group: 'travel', title: 'Taxi & Rideshare', zh: '打车出行', level: 'B1',
    desc: '上车指路、聊天、处理绕路与付款',
    persona: 'You are a talkative taxi driver. Ask where to, take a preferred route question, make small talk, and handle the fare and tip at the end.',
    opener: 'Hop in! Where are we headed today?',
    phrases: [
      { en: 'Could you take me to this address?', zh: '请送我到这个地址。' },
      { en: 'Could you go a bit slower, please?', zh: '能开慢一点吗?' },
      { en: 'Please stop here — I’ll walk the rest.', zh: '在这里停吧,剩下我走过去。' },
      { en: 'Do you take card?', zh: '能刷卡吗?' },
      { en: 'Keep the change.', zh: '不用找了。' }
    ],
    vocab: [
      { en: 'meter', zh: '计价器' },
      { en: 'rush hour', zh: '高峰期' },
      { en: 'traffic jam', zh: '堵车' },
      { en: 'pull over', zh: '靠边停车' },
      { en: 'detour', zh: '绕路' },
      { en: 'drop-off', zh: '下车点' },
      { en: 'ride-hailing', zh: '网约车' },
      { en: 'receipt', zh: '发票;收据' }
    ]
  }),
  S({
    id: 'food-abroad', emoji: '🥗', group: 'travel', title: 'Ordering Abroad & Allergies', zh: '国外点餐与忌口', level: 'B2',
    desc: '海外餐厅点餐、说明忌口、处理上错菜',
    persona: 'You are a waiter at an Italian restaurant abroad. The learner has dietary restrictions. Handle questions about ingredients, a wrong order arriving, and paying separately.',
    opener: 'Buonasera! Tonight’s specials are on the board — have you dined with us before?',
    phrases: [
      { en: 'I’m vegetarian — does this contain any meat?', zh: '我是素食者,这道含肉吗?' },
      { en: 'Could I have this without dairy?', zh: '这道能不加奶制品吗?' },
      { en: 'Excuse me, I think this isn’t what I ordered.', zh: '不好意思,这好像不是我点的。' },
      { en: 'Is service included in the bill?', zh: '账单含服务费吗?' },
      { en: 'We’d like to pay separately, please.', zh: '我们想分开付。' }
    ],
    vocab: [
      { en: 'allergy', zh: '过敏' },
      { en: 'lactose intolerant', zh: '乳糖不耐受' },
      { en: 'raw / undercooked', zh: '生的 / 未全熟' },
      { en: 'sauce on the side', zh: '酱汁另放' },
      { en: 'specials', zh: '特色菜' },
      { en: 'tip the server', zh: '给服务员小费' },
      { en: 'gluten-free', zh: '无麸质' },
      { en: 'complimentary', zh: '免费赠送的' }
    ]
  }),
  S({
    id: 'trouble', emoji: '🧳', group: 'travel', title: 'Travel Trouble: Lost Luggage', zh: '旅途麻烦:行李丢失', level: 'B2',
    desc: '行李丢失、改签、投诉等突发状况沟通',
    persona: 'You are a lost-luggage agent at an airport baggage service desk. Take a report for a missing suitcase, ask for details, explain compensation, and promise a follow-up.',
    opener: 'I’m sorry to hear your bag didn’t arrive. Let’s get this sorted — can I see your baggage tag and boarding pass?',
    phrases: [
      { en: 'My suitcase didn’t come out at baggage claim.', zh: '行李转盘没等到我的箱子。' },
      { en: 'It’s a dark blue hard-shell suitcase.', zh: '是个深蓝色硬壳行李箱。' },
      { en: 'I need essentials tonight — can you help?', zh: '我今晚需要必需品,能帮帮我吗?' },
      { en: 'How will I be compensated?', zh: '会怎么补偿?' },
      { en: 'Could you give me a reference number?', zh: '能给我一个查询编号吗?' }
    ],
    vocab: [
      { en: 'baggage claim', zh: '行李提取处' },
      { en: 'claim tag', zh: '行李票' },
      { en: 'delayed baggage', zh: '延误行李' },
      { en: 'compensation', zh: '赔偿' },
      { en: 'rebook / reschedule', zh: '改签' },
      { en: 'voucher', zh: '代金券' },
      { en: 'escalate', zh: '上报;升级处理' },
      { en: 'follow up', zh: '跟进' }
    ]
  }),

  // ---------- 职场专业 ----------
  S({
    id: 'interview', emoji: '🧑‍💼', group: 'work', title: 'Job Interview', zh: '求职面试', level: 'B2',
    desc: '自我介绍、STAR 法答题、向面试官提问',
    persona: 'You are a friendly but rigorous hiring manager interviewing the learner for a role they want. Ask classic questions: self-introduction, strengths and weaknesses, a challenging project (push for concrete results with numbers), why this company, and career goals. End by inviting their questions.',
    opener: "Thanks for coming in today! Let's start simple — could you tell me a bit about yourself and your background?",
    phrases: [
      { en: 'I have three years of experience in…', zh: '我有三年……领域经验。' },
      { en: 'In my last role, I was responsible for…', zh: '在上一份工作中,我负责……' },
      { en: 'That’s a great question. Let me think…', zh: '好问题,让我想想……' },
      { en: 'I led a project that improved…by 20%.', zh: '我主导的项目把……提升了 20%。' },
      { en: 'Do you have any concerns about my application?', zh: '您对我的申请有什么顾虑吗?' }
    ],
    vocab: [
      { en: 'resume / CV', zh: '简历' },
      { en: 'strengths / weaknesses', zh: '优势 / 短板' },
      { en: 'achievement', zh: '成就' },
      { en: 'career path', zh: '职业路径' },
      { en: 'notice period', zh: '离职通知期' },
      { en: 'salary expectation', zh: '薪资期望' },
      { en: 'onboarding', zh: '入职培训' },
      { en: 'follow up', zh: '跟进(面试后)' }
    ]
  }),
  S({
    id: 'intro', emoji: '🤝', group: 'work', title: 'Networking & Self-intro', zh: '自我介绍与社交', level: 'B1',
    desc: '行业活动上破冰、交换名片、要联系方式',
    persona: 'You are a fellow attendee at an industry meetup. Break the ice, exchange backgrounds, find common ground, and close the conversation by suggesting to stay in touch.',
    opener: 'Hi! Great talk up there, right? I don’t think we’ve met — I’m Jordan, I work in product.',
    phrases: [
      { en: 'What brings you here today?', zh: '今天是什么让您来的?' },
      { en: 'What do you do exactly?', zh: '您具体做什么工作?' },
      { en: 'How do you two know each other?', zh: '你们俩怎么认识的?' },
      { en: 'Could I get your contact info?', zh: '能留个联系方式吗?' },
      { en: 'It was great talking with you!', zh: '很高兴和您交流!' }
    ],
    vocab: [
      { en: 'networking', zh: '建立人脉' },
      { en: 'icebreaker', zh: '破冰话题' },
      { en: 'business card', zh: '名片' },
      { en: 'common ground', zh: '共同点' },
      { en: 'small world', zh: '真巧,世界真小' },
      { en: 'keep in touch', zh: '保持联系' },
      { en: 'follow up on', zh: '后续跟进' },
      { en: 'mutual connection', zh: '共同好友/人脉' }
    ]
  }),
  S({
    id: 'standup', emoji: '📋', group: 'work', title: 'Daily Standup', zh: '每日站会', level: 'B2',
    desc: '汇报昨天/今天/风险,练习简洁汇报',
    persona: 'You are the team lead running a daily standup. Ask each classic question (yesterday / today / blockers), respond to updates, and dig briefly into one blocker.',
    opener: "Morning everyone! Let's keep it snappy — I'll go first, then you. So, what did you get done yesterday?",
    phrases: [
      { en: 'Yesterday I wrapped up…', zh: '昨天我完成了……' },
      { en: 'Today I’m planning to focus on…', zh: '今天我打算集中做……' },
      { en: 'I’m blocked on / waiting for…', zh: '我被……卡住了 / 在等……' },
      { en: 'It should be done by end of day.', zh: '预计今天下班前完成。' },
      { en: 'Could we sync after standup?', zh: '站会后能单独对一下吗?' }
    ],
    vocab: [
      { en: 'standup', zh: '站会' },
      { en: 'blocker', zh: '阻碍;卡点' },
      { en: 'deadline', zh: '截止日期' },
      { en: 'priority', zh: '优先级' },
      { en: 'wrap up', zh: '收尾;完成' },
      { en: 'push back', zh: '延期;推后' },
      { en: 'scope', zh: '范围' },
      { en: 'action item', zh: '待办事项' }
    ]
  }),
  S({
    id: 'meeting', emoji: '💬', group: 'work', title: 'Team Meeting & Disagreement', zh: '会议讨论与反对', level: 'B2',
    desc: '会中发言、提出反对意见、推进决策',
    persona: 'You are a colleague proposing an idea in a team meeting. Invite the learner’s opinion; when they push back, respond professionally, ask clarifying questions, and work toward a compromise.',
    opener: 'So I was thinking we could ship the feature in two phases instead of one — what do you think about that?',
    phrases: [
      { en: 'Sorry to interrupt, but I see it differently.', zh: '抱歉打断,我的看法不太一样。' },
      { en: 'Just to play devil’s advocate…', zh: '让我从反面提个醒……' },
      { en: 'Could you elaborate on that?', zh: '能展开讲讲吗?' },
      { en: 'Let’s table that for now and circle back.', zh: '这个先放一放,回头再议。' },
      { en: 'Can we align on the next steps?', zh: '我们对一下下一步吧?' }
    ],
    vocab: [
      { en: 'agenda', zh: '议程' },
      { en: 'on the same page', zh: '达成一致' },
      { en: 'elaborate', zh: '详细说明' },
      { en: 'compromise', zh: '妥协;折中' },
      { en: 'table it', zh: '搁置讨论' },
      { en: 'consensus', zh: '共识' },
      { en: 'bring up', zh: '提出' },
      { en: 'minutes', zh: '会议纪要' }
    ]
  }),
  S({
    id: 'present', emoji: '📊', group: 'work', title: 'Presentation & Demo', zh: '演示汇报', level: 'B2',
    desc: '做展示、应对提问、处理意外',
    persona: 'You are the audience of the learner’s short presentation. After they present, ask two challenging but fair questions, and give structured feedback like a senior manager.',
    opener: 'Alright, we’re all set — the floor is yours. Take it away!',
    phrases: [
      { en: 'Today I’ll walk you through…', zh: '今天我将带大家了解……' },
      { en: 'Let’s move on to the next slide.', zh: '我们看下一页。' },
      { en: 'That’s a good segue to my next point.', zh: '这正好引出我的下一点。' },
      { en: 'To put that into perspective…', zh: '换个角度看……' },
      { en: 'Happy to take questions now.', zh: '现在欢迎提问。' }
    ],
    vocab: [
      { en: 'slide deck', zh: '幻灯片' },
      { en: 'key takeaway', zh: '核心要点' },
      { en: 'high-level overview', zh: '概览' },
      { en: 'dive into', zh: '深入' },
      { en: 'benchmark', zh: '基准;对标' },
      { en: 'ROI', zh: '投资回报率' },
      { en: 'elevator pitch', zh: '电梯演讲' },
      { en: 'Q&A', zh: '问答环节' }
    ]
  }),
  S({
    id: 'negotiate', emoji: '📉', group: 'work', title: 'Negotiating with a Client', zh: '客户谈判', level: 'C1',
    desc: '报价、还价、让步与促成合作',
    persona: 'You are a procurement manager negotiating a contract with the learner, who is selling a service. Push for a discount, ask about scope, propose terms, and drive toward signing.',
    opener: "Thanks for the proposal — the team likes the direction, but frankly, your quote came in above our budget. What can you do about the price?",
    phrases: [
      { en: 'Let’s find a middle ground.', zh: '我们找个折中方案。' },
      { en: 'If you can commit to a longer term, we can adjust the price.', zh: '如果您能签更长期,价格可以调。' },
      { en: 'That’s beyond what we can authorize.', zh: '这超出我们的授权范围。' },
      { en: 'Could you walk me through the pricing?', zh: '能讲讲定价构成吗?' },
      { en: 'I think we’re close to a deal.', zh: '我觉得快谈成了。' }
    ],
    vocab: [
      { en: 'quote', zh: '报价' },
      { en: 'budget', zh: '预算' },
      { en: 'concession', zh: '让步' },
      { en: 'terms', zh: '条款' },
      { en: 'win-win', zh: '双赢' },
      { en: 'leverage', zh: '筹码;影响力' },
      { en: 'bottom line', zh: '底线' },
      { en: 'close the deal', zh: '成交' }
    ]
  }),
  S({
    id: 'oneonone', emoji: '🗂️', group: 'work', title: '1:1 with Your Manager', zh: '与上司一对一', level: 'B2',
    desc: '汇报进展、要反馈、谈加薪或晋升',
    persona: 'You are the learner’s supportive manager in a monthly 1:1. Ask about their progress and wellbeing, give feedback, and be ready to discuss a raise or growth path when asked.',
    opener: 'Hey, thanks for making time. How have the last few weeks been for you — anything on your mind?',
    phrases: [
      { en: 'I’d love some feedback on…', zh: '我想请您对……给点反馈。' },
      { en: 'I feel ready to take on more responsibility.', zh: '我觉得可以承担更多责任了。' },
      { en: 'Could we discuss my growth path?', zh: '能聊聊我的成长路径吗?' },
      { en: 'I’d like to request a raise, given…', zh: '考虑到……我想申请加薪。' },
      { en: 'What would it take to get to the next level?', zh: '晋升到下一级需要做到什么?' }
    ],
    vocab: [
      { en: 'feedback', zh: '反馈' },
      { en: 'performance review', zh: '绩效评估' },
      { en: 'promotion', zh: '晋升' },
      { en: 'raise', zh: '加薪' },
      { en: 'milestone', zh: '里程碑' },
      { en: 'workload', zh: '工作量' },
      { en: 'burnout', zh: '职业倦怠' },
      { en: 'recognition', zh: '认可' }
    ]
  }),
  S({
    id: 'support', emoji: '🎧', group: 'work', title: 'Customer Support Call', zh: '客服沟通', level: 'B1',
    desc: '作为客服处理投诉,练习安抚与解决',
    persona: 'You are an upset but reasonable customer calling about a late delivery and a damaged item. Stay calm, describe the problem, and accept solutions if the learner handles it well.',
    opener: 'Hi, yes — I ordered a package two weeks ago and it still hasn’t arrived. And when I called last time, nobody got back to me!',
    phrases: [
      { en: 'I’m really sorry for the inconvenience.', zh: '非常抱歉给您带来不便。' },
      { en: 'Let me look into that for you right away.', zh: '我马上为您查一下。' },
      { en: 'Here’s what I can do:', zh: '我可以这样处理:' },
      { en: 'Would a refund work for you?', zh: '给您退款可以吗?' },
      { en: 'Thanks for your patience.', zh: '感谢您的耐心等待。' }
    ],
    vocab: [
      { en: 'complaint', zh: '投诉' },
      { en: 'refund', zh: '退款' },
      { en: 'replacement', zh: '换货;补发' },
      { en: 'inconvenience', zh: '不便' },
      { en: 'issue a refund', zh: '处理退款' },
      { en: 'tracking number', zh: '物流单号' },
      { en: 'apologize', zh: '道歉' },
      { en: 'resolve', zh: '解决' }
    ]
  }),
  S({
    id: 'it', emoji: '💻', group: 'work', title: 'Talking Tech: Software & IT', zh: '技术话题:软件工程', level: 'B2',
    desc: '和工程师聊架构、bug、代码评审',
    persona: 'You are a senior engineer chatting with the learner about a project. Discuss architecture trade-offs, a tricky bug, code review etiquette, and deployment.',
    opener: 'Hey! Before you dive in — we’re seeing random 500s in production. Got a sec to look at the logs with me?',
    phrases: [
      { en: 'It’s a race condition, most likely.', zh: '八成是竞态条件。' },
      { en: 'Can you reproduce it locally?', zh: '本地能复现吗?' },
      { en: 'I’d suggest a quick fix first, then a proper refactor.', zh: '我建议先打补丁,再正式重构。' },
      { en: 'Could you review my pull request?', zh: '能帮我看看 PR 吗?' },
      { en: 'Let’s roll it out behind a feature flag.', zh: '我们用 feature flag 灰度上线吧。' }
    ],
    vocab: [
      { en: 'deploy / release', zh: '部署 / 发布' },
      { en: 'bug / edge case', zh: '缺陷 / 边界情况' },
      { en: 'refactor', zh: '重构' },
      { en: 'scalability', zh: '可扩展性' },
      { en: 'code review', zh: '代码评审' },
      { en: 'rollback', zh: '回滚' },
      { en: 'workaround', zh: '临时解决方案' },
      { en: 'technical debt', zh: '技术债' }
    ]
  }),
  S({
    id: 'finance', emoji: '📈', group: 'work', title: 'Business & Finance Talk', zh: '商务金融话题', level: 'B2',
    desc: '聊财报、市场趋势和商业决策',
    persona: 'You are a finance-savvy colleague discussing a company’s quarterly results and market trends. Ask the learner to interpret numbers and defend a business decision.',
    opener: 'Quarterly results just dropped — revenue is up 12% but margins are shrinking. What’s your read on that?',
    phrases: [
      { en: 'Revenue grew year over year.', zh: '营收同比增长。' },
      { en: 'The margins are getting squeezed.', zh: '利润空间被挤压。' },
      { en: 'It’s a short-term investment for long-term gain.', zh: '这是为了长期收益的短期投入。' },
      { en: 'We need to cut costs without cutting corners.', zh: '我们要降本但不能偷工减料。' },
      { en: 'The outlook is cautiously optimistic.', zh: '展望是谨慎乐观的。' }
    ],
    vocab: [
      { en: 'revenue', zh: '营收' },
      { en: 'profit margin', zh: '利润率' },
      { en: 'quarter', zh: '季度' },
      { en: 'stakeholder', zh: '利益相关方' },
      { en: 'forecast', zh: '预测' },
      { en: 'market share', zh: '市场份额' },
      { en: 'cost-effective', zh: '划算的;性价比高的' },
      { en: 'due diligence', zh: '尽职调查' }
    ]
  })
]

export const findScenario = (id: string): Scenario | undefined =>
  SCENARIOS.find((s) => s.id === id)
