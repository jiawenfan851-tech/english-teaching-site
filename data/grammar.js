window.GRAMMAR_DATA = [
  {
    id: "g7-be",
    grade: "grade7",
    category: "句子根基",
    title: "be 动词与人称",
    summary: "be 动词像句子的连接桥，把“谁”与身份、状态或位置连接起来。它会随着主语变成 am、is 或 are。",
    formula: "I am ... / He, She, It is ... / You, We, They are ...",
    examples: [
      { en: "I am ready for class.", zh: "我已经准备好上课了。" },
      { en: "The books are on the desk.", zh: "书在桌上。" }
    ],
    pitfall: "否定词 not 放在 be 后面；疑问句把 be 移到主语前面。",
    question: "Which sentence is correct?",
    options: ["She are friendly.", "She is friendly.", "She am friendly.", "She be friendly."],
    answer: 1,
    explanation: "主语 she 是第三人称单数，所以使用 is。"
  },
  {
    id: "g7-pronouns",
    grade: "grade7",
    category: "句子根基",
    title: "人称、物主与反身代词",
    summary: "代词让表达不必反复说同一个名字。主格做动作，宾格承受动作；形容词性物主代词后面要接名词。",
    formula: "I-me-my-mine-myself / she-her-her-hers-herself",
    examples: [
      { en: "She gave me her notebook.", zh: "她把她的笔记本给了我。" },
      { en: "We finished the work ourselves.", zh: "我们自己完成了这项工作。" }
    ],
    pitfall: "my 后面要有名词；mine 本身就等于 my + 名词，后面不再接名词。",
    question: "This book is not yours. It is ____.",
    options: ["my", "me", "mine", "myself"],
    answer: 2,
    explanation: "空格后没有名词，要用名词性物主代词 mine。"
  },
  {
    id: "g7-nouns-articles",
    grade: "grade7",
    category: "名词世界",
    title: "名词单复数与冠词",
    summary: "可数名词能数出一个、两个；不可数名词通常不直接与数字连用。a/an 表示泛指一个，the 指双方都知道的那一个。",
    formula: "a consonant sound / an vowel sound / the specific one",
    examples: [
      { en: "I saw an old bridge near the river.", zh: "我在河边看见一座古老的桥。" },
      { en: "The bridge was built in 1920.", zh: "那座桥建于 1920 年。" }
    ],
    pitfall: "a/an 看的是读音，不只是字母；an hour 中 h 不发音，所以用 an。",
    question: "He is ____ honest boy.",
    options: ["a", "an", "the", "some"],
    answer: 1,
    explanation: "honest 的 h 不发音，开头是元音音素，所以用 an。"
  },
  {
    id: "g7-demonstratives",
    grade: "grade7",
    category: "名词世界",
    title: "this、that、these 与 those",
    summary: "这组词同时表达远近和单复数：this/these 较近，that/those 较远。谓语也要与单复数保持一致。",
    formula: "this is / that is / these are / those are",
    examples: [
      { en: "This is my seat.", zh: "这是我的座位。" },
      { en: "Those are our science projects.", zh: "那些是我们的科学项目。" }
    ],
    pitfall: "these 和 those 都是复数，不能与 is 连用。",
    question: "____ flowers over there are beautiful.",
    options: ["This", "That", "These", "Those"],
    answer: 3,
    explanation: "flowers 是复数，over there 表示较远，所以选择 Those。"
  },
  {
    id: "g7-there-be",
    grade: "grade7",
    category: "句子根基",
    title: "There be 句型",
    summary: "There be 用来告诉别人某处“有”什么。be 的单复数通常跟离它最近的名词保持一致。",
    formula: "There is + singular / There are + plural",
    examples: [
      { en: "There is a quiet garden behind the library.", zh: "图书馆后面有一座安静的花园。" },
      { en: "There are two windows in the room.", zh: "房间里有两扇窗。" }
    ],
    pitfall: "There have 不是表示“某处有”的标准结构；人或物“拥有”才用 have/has。",
    question: "There ____ a pen and two books on the desk.",
    options: ["is", "are", "have", "has"],
    answer: 0,
    explanation: "离 be 最近的是单数 a pen，因此用 is。"
  },
  {
    id: "g7-present-simple",
    grade: "grade7",
    category: "时间与动作",
    title: "一般现在时",
    summary: "一般现在时描述习惯、经常发生的事和客观事实。主语为 he、she、it 时，实义动词通常要加 -s 或 -es。",
    formula: "I/You/We/They do / He/She/It does",
    examples: [
      { en: "Light travels faster than sound.", zh: "光比声音传播得快。" },
      { en: "Mia reads before she goes to bed.", zh: "米娅睡前会阅读。" }
    ],
    pitfall: "用了 does 或 doesn't 以后，后面的动词要回到原形。",
    question: "Does Leo ____ to school by bike?",
    options: ["go", "goes", "going", "went"],
    answer: 0,
    explanation: "助动词 does 已经承担了变化，实义动词使用原形 go。"
  },
  {
    id: "g7-frequency",
    grade: "grade7",
    category: "时间与动作",
    title: "频度副词",
    summary: "always、usually、often、sometimes、hardly 和 never 说明动作发生得多频繁。它们通常放在实义动词前、be 动词后。",
    formula: "subject + frequency adverb + verb / be + frequency adverb",
    examples: [
      { en: "We often practise speaking after class.", zh: "我们经常在课后练习口语。" },
      { en: "She is always kind to new students.", zh: "她总是友善地对待新同学。" }
    ],
    pitfall: "never 本身已经是否定意义，句中一般不再加 not。",
    question: "My father is ____ late for work. He is always on time.",
    options: ["often", "usually", "never", "always"],
    answer: 2,
    explanation: "后句说明他总是准时，因此前句应为“从不迟到”。"
  },
  {
    id: "g7-present-continuous",
    grade: "grade7",
    category: "时间与动作",
    title: "现在进行时",
    summary: "现在进行时把镜头对准正在发生的动作，也可以描述当前阶段正在进行的事情。",
    formula: "am / is / are + verb-ing",
    examples: [
      { en: "Listen! Someone is singing downstairs.", zh: "听！有人正在楼下唱歌。" },
      { en: "We are reading a novel this month.", zh: "这个月我们正在读一本小说。" }
    ],
    pitfall: "结构中不能漏掉 be；一些状态动词如 know、like 通常不用进行时。",
    question: "Look! The children ____ in the rain.",
    options: ["play", "plays", "are playing", "played"],
    answer: 2,
    explanation: "Look 提示动作正在发生，主语为复数，使用 are playing。"
  },
  {
    id: "g7-can",
    grade: "grade7",
    category: "情态与态度",
    title: "can：能力与请求",
    summary: "can 可以表达能力、许可和请求。情态动词没有人称变化，后面始终跟动词原形。",
    formula: "can + base verb / cannot (can't) + base verb",
    examples: [
      { en: "I can understand the main idea.", zh: "我能理解大意。" },
      { en: "Can you open the window, please?", zh: "请你打开窗户好吗？" }
    ],
    pitfall: "不能说 can to do，也不能因主语是 he/she 就写成 cans。",
    question: "Emma can ____ very well.",
    options: ["swims", "swimming", "to swim", "swim"],
    answer: 3,
    explanation: "can 后使用动词原形 swim。"
  },
  {
    id: "g7-imperatives",
    grade: "grade7",
    category: "交流表达",
    title: "祈使句与 Let's",
    summary: "祈使句省略主语 you，直接用动词原形表达指令、提醒或邀请；Let's 用来提出一起行动的建议。",
    formula: "Do ... / Don't do ... / Let's do ... / Let's not do ...",
    examples: [
      { en: "Please keep your voice down.", zh: "请小声一点。" },
      { en: "Let's take a short break.", zh: "我们短暂休息一下吧。" }
    ],
    pitfall: "否定祈使句用 Don't + 动词原形；Let's 的否定形式是 Let's not。",
    question: "____ afraid of making mistakes.",
    options: ["Don't be", "Not be", "Doesn't be", "No be"],
    answer: 0,
    explanation: "否定祈使句使用 Don't + 动词原形。"
  },
  {
    id: "g7-prepositions",
    grade: "grade7",
    category: "名词世界",
    title: "时间与地点介词",
    summary: "介词帮助我们确定时间和空间关系。at 常指时刻或点，on 常指具体日期或表面，in 常指较长时间或内部空间。",
    formula: "at 7:00 / on Monday / in July; at school / on the wall / in the room",
    examples: [
      { en: "The meeting starts at nine on Friday.", zh: "会议周五九点开始。" },
      { en: "There is a map on the wall.", zh: "墙上有一张地图。" }
    ],
    pitfall: "表示 next、last、this、every 开头的时间时，前面通常不加介词。",
    question: "We have a music lesson ____ Tuesday afternoon.",
    options: ["at", "on", "in", "for"],
    answer: 1,
    explanation: "具体某一天的上午、下午或晚上使用 on。"
  },
  {
    id: "g7-wh-questions",
    grade: "grade7",
    category: "交流表达",
    title: "特殊疑问句",
    summary: "what、who、where、when、why、which、whose 和 how 决定我们想知道哪一种信息，后面通常接一般疑问句语序。",
    formula: "WH-word + be/auxiliary + subject + ...?",
    examples: [
      { en: "Why do you enjoy reading?", zh: "你为什么喜欢阅读？" },
      { en: "How far is the station from here?", zh: "车站离这里有多远？" }
    ],
    pitfall: "疑问词本身作主语时不倒装，例如 Who knows the answer?",
    question: "____ do you visit your grandparents? Twice a month.",
    options: ["How long", "How often", "How far", "How soon"],
    answer: 1,
    explanation: "Twice a month 回答的是频率，因此用 How often。"
  },
  {
    id: "g8-past-simple",
    grade: "grade8",
    category: "时间与动作",
    title: "一般过去时",
    summary: "一般过去时描述在过去已经发生并结束的事情。规则动词加 -ed，不规则动词需要掌握特殊变化。",
    formula: "subject + verb-ed / did not + base verb / Did ... + base verb?",
    examples: [
      { en: "We visited the museum last weekend.", zh: "上周末我们参观了博物馆。" },
      { en: "Did you notice the small door?", zh: "你注意到那扇小门了吗？" }
    ],
    pitfall: "出现 did 或 didn't 后，后面的动词必须回到原形。",
    question: "They ____ home late yesterday.",
    options: ["come", "comes", "came", "coming"],
    answer: 2,
    explanation: "yesterday 表示过去，come 的过去式是 came。"
  },
  {
    id: "g8-past-continuous",
    grade: "grade8",
    category: "时间与动作",
    title: "过去进行时",
    summary: "过去进行时把镜头放在过去某一时刻正在发生的动作上，常与 when 或 while 连用。",
    formula: "was / were + verb-ing",
    examples: [
      { en: "I was doing my homework at eight.", zh: "八点时我正在做作业。" },
      { en: "While we were walking, it began to snow.", zh: "我们走路时，天开始下雪了。" }
    ],
    pitfall: "when 常引出较短的动作，while 常引出持续中的动作，但要根据实际语义判断。",
    question: "When the phone rang, I ____ a shower.",
    options: ["take", "took", "was taking", "am taking"],
    answer: 2,
    explanation: "电话响起时，洗澡这一动作正在持续，使用 was taking。"
  },
  {
    id: "g8-future",
    grade: "grade8",
    category: "时间与动作",
    title: "will 与 be going to",
    summary: "will 常用于临时决定、预测或承诺；be going to 常表示已有计划，或根据眼前迹象作出的判断。",
    formula: "will + base verb / am-is-are going to + base verb",
    examples: [
      { en: "I will answer the door.", zh: "我去开门。（当下决定）" },
      { en: "Look at those clouds. It is going to rain.", zh: "看那些云，要下雨了。" }
    ],
    pitfall: "在 when、if 等时间或条件从句中，常用一般现在时表达将来。",
    question: "If it is sunny tomorrow, we ____ a picnic.",
    options: ["have", "had", "will have", "are having yesterday"],
    answer: 2,
    explanation: "if 从句用一般现在时，主句用 will + 动词原形。"
  },
  {
    id: "g8-comparison",
    grade: "grade8",
    category: "描述与比较",
    title: "比较级与最高级",
    summary: "比较级比较两者，最高级在三者或以上中找出程度最高者。不规则形式如 good-better-best 要单独记忆。",
    formula: "-er / more ... than; the -est / the most ...; as ... as",
    examples: [
      { en: "This path is safer than the old one.", zh: "这条路比旧路更安全。" },
      { en: "Lena is one of the most careful students.", zh: "莉娜是最细心的学生之一。" }
    ],
    pitfall: "不要把 more 与 -er 重复使用；one of 后面接最高级和复数名词。",
    question: "The more you practise, the ____ you become.",
    options: ["confident", "more confident", "most confident", "confidence"],
    answer: 1,
    explanation: "the + 比较级..., the + 比较级... 表示“越……越……”。"
  },
  {
    id: "g8-quantifiers",
    grade: "grade8",
    category: "名词世界",
    title: "数量词与不定代词",
    summary: "many/few 修饰可数名词复数，much/little 修饰不可数名词；a few/a little 表示“有一些”，不带 a 时更偏否定。",
    formula: "many / a few + plural; much / a little + uncountable",
    examples: [
      { en: "We still have a little time.", zh: "我们还有一点时间。" },
      { en: "Few people knew the answer.", zh: "几乎没人知道答案。" }
    ],
    pitfall: "something、anything、nothing 被形容词修饰时，形容词要后置，如 something useful。",
    question: "There is ____ milk left, so we can make tea.",
    options: ["a few", "few", "a little", "many"],
    answer: 2,
    explanation: "milk 不可数，而且句意表示还有一些，所以用 a little。"
  },
  {
    id: "g8-infinitives",
    grade: "grade8",
    category: "非谓语动词",
    title: "动词不定式",
    summary: "to + 动词原形可以作目的、宾语、主语或补语。它常带有“尚未发生、目的或计划”的意味。",
    formula: "to do / verb + to do / ask somebody to do / it is ... to do",
    examples: [
      { en: "I hope to hear from you soon.", zh: "我希望很快收到你的来信。" },
      { en: "It is important to listen carefully.", zh: "认真倾听很重要。" }
    ],
    pitfall: "make、let 后接不带 to 的动词原形；ask、tell、want 后接 somebody to do。",
    question: "Our teacher asked us ____ the passage aloud.",
    options: ["read", "reading", "to read", "reads"],
    answer: 2,
    explanation: "ask somebody to do something 是固定结构。"
  },
  {
    id: "g8-gerunds",
    grade: "grade8",
    category: "非谓语动词",
    title: "动名词与动词 -ing",
    summary: "动词 -ing 可以像名词一样作主语或宾语。enjoy、finish、mind、practise 等动词后通常接 doing。",
    formula: "doing as a noun / enjoy-finish-mind-practise + doing",
    examples: [
      { en: "Reading opens a window to the world.", zh: "阅读为我们打开一扇通往世界的窗。" },
      { en: "She enjoys solving difficult problems.", zh: "她喜欢解决难题。" }
    ],
    pitfall: "介词后面的动词要用 -ing，如 be good at speaking。",
    question: "Would you mind ____ the door?",
    options: ["close", "to close", "closing", "closed"],
    answer: 2,
    explanation: "mind 后接动名词，使用 closing。"
  },
  {
    id: "g8-modals",
    grade: "grade8",
    category: "情态与态度",
    title: "must、have to 与 should",
    summary: "must 表达说话者认为必须做，have to 常强调外部规定或客观需要，should 给出建议。",
    formula: "must / should + base verb; have-has to + base verb",
    examples: [
      { en: "You must wear a helmet here.", zh: "你在这里必须戴头盔。" },
      { en: "You should give yourself more time.", zh: "你应该给自己多一点时间。" }
    ],
    pitfall: "mustn't 表示“禁止”，don't have to 表示“不必”，两者意思不同。",
    question: "You ____ bring food. We have prepared enough for everyone.",
    options: ["mustn't", "don't have to", "shouldn't to", "must"],
    answer: 1,
    explanation: "已经准备了足够食物，所以“不必”带，用 don't have to。"
  },
  {
    id: "g8-clauses",
    grade: "grade8",
    category: "复合句",
    title: "原因、让步与时间状语从句",
    summary: "because 说明原因，although/though 表达让步，when/while/as soon as 连接时间。连接词让两个动作之间的关系更清楚。",
    formula: "because + cause / although + contrast / when-while-as soon as + time",
    examples: [
      { en: "Although it was late, no one wanted to leave.", zh: "虽然很晚了，但没人想离开。" },
      { en: "Call me as soon as you arrive.", zh: "你一到就给我打电话。" }
    ],
    pitfall: "英语中 because 不与 so 连用，although/though 不与 but 连用。",
    question: "____ the task was difficult, the team finished it on time.",
    options: ["Because", "Although", "So", "Unless"],
    answer: 1,
    explanation: "前后是让步转折关系，用 Although。"
  },
  {
    id: "g8-present-perfect",
    grade: "grade8",
    category: "时间与动作",
    title: "现在完成时",
    summary: "现在完成时连接过去与现在：过去发生的事对现在有结果，或某种经历、状态一直延续到现在。",
    formula: "have / has + past participle",
    examples: [
      { en: "I have lost my key.", zh: "我把钥匙弄丢了。（现在还没有）" },
      { en: "She has lived here for five years.", zh: "她已经在这里住了五年。" }
    ],
    pitfall: "for 后接一段时间，since 后接起点；瞬间动词不能直接与一段时间连用。",
    question: "We have known each other ____ 2021.",
    options: ["for", "since", "from", "during"],
    answer: 1,
    explanation: "2021 是时间起点，使用 since。"
  },
  {
    id: "g8-passive",
    grade: "grade8",
    category: "句子结构",
    title: "一般时态的被动语态",
    summary: "当我们更关心动作承受者，或不知道动作执行者时使用被动语态。时态由 be 表示，主要动作变为过去分词。",
    formula: "am-is-are + done / was-were + done",
    examples: [
      { en: "English is spoken in many countries.", zh: "许多国家使用英语。" },
      { en: "The bridge was built last century.", zh: "这座桥建于上个世纪。" }
    ],
    pitfall: "不要漏掉 be，也不要把过去式误当成过去分词，如 write-wrote-written。",
    question: "The classroom ____ every afternoon.",
    options: ["cleans", "is cleaned", "cleaned", "was clean"],
    answer: 1,
    explanation: "教室是被打扫，且 every afternoon 表示一般现在时，用 is cleaned。"
  },
  {
    id: "g8-object-clauses",
    grade: "grade8",
    category: "复合句",
    title: "宾语从句",
    summary: "宾语从句把一个完整的小句放在动词后，作为“知道、认为、询问”的内容。陈述事实用 that，是否用 if/whether，具体信息用疑问词。",
    formula: "verb + that / if-whether / WH-word + statement order",
    examples: [
      { en: "I believe that every effort matters.", zh: "我相信每一份努力都有意义。" },
      { en: "Do you know where the library is?", zh: "你知道图书馆在哪里吗？" }
    ],
    pitfall: "宾语从句使用陈述语序：where the library is，不是 where is the library。",
    question: "Could you tell me ____?",
    options: ["when does the train leave", "when the train leaves", "when did leave the train", "the train leaves when"],
    answer: 1,
    explanation: "宾语从句使用“疑问词 + 主语 + 谓语”的陈述语序。"
  },
  {
    id: "g9-perfect-vs-past",
    grade: "grade9",
    category: "时间与动作",
    title: "现在完成时与一般过去时",
    summary: "一般过去时聚焦过去某个已结束的时间；现在完成时关心过去与现在的联系，通常不与明确的过去时间点连用。",
    formula: "finished past time -> did; present result or experience -> have done",
    examples: [
      { en: "I visited Xi'an in 2024.", zh: "我在 2024 年游览了西安。" },
      { en: "I have visited Xi'an twice.", zh: "我去过西安两次。" }
    ],
    pitfall: "yesterday、last year、in 2024 等明确过去时间通常与一般过去时连用。",
    question: "I ____ this film before, so I know the ending.",
    options: ["saw yesterday", "have seen", "see", "am seeing"],
    answer: 1,
    explanation: "before 表示截至现在的经历，并且影响现在，使用 have seen。"
  },
  {
    id: "g9-passive-tenses",
    grade: "grade9",
    category: "句子结构",
    title: "不同时态的被动语态",
    summary: "被动语态的核心始终是 be + done。要表达时态，只需让 be 发生相应变化：will be、has been、can be 等。",
    formula: "will be done / have-has been done / modal + be done",
    examples: [
      { en: "The results will be announced tomorrow.", zh: "结果将于明天公布。" },
      { en: "The work has already been finished.", zh: "工作已经完成了。" }
    ],
    pitfall: "情态动词后使用 be done，不是 is done；完成时被动中不要漏掉 been。",
    question: "More trees should ____ in the city.",
    options: ["plant", "be planted", "are planted", "planted"],
    answer: 1,
    explanation: "情态动词的被动结构是 should + be + 过去分词。"
  },
  {
    id: "g9-relative-clauses",
    grade: "grade9",
    category: "复合句",
    title: "定语从句",
    summary: "定语从句紧跟在名词后面，为它补充信息。who/that 指人，which/that 指物；关系词在从句中还承担句子成分。",
    formula: "person + who-that ... / thing + which-that ...",
    examples: [
      { en: "The girl who won the race is my cousin.", zh: "赢得比赛的女孩是我的表妹。" },
      { en: "This is the book that changed my mind.", zh: "这就是改变我想法的那本书。" }
    ],
    pitfall: "关系词作从句宾语时常可省略；作主语时不能省略。",
    question: "The teacher ____ helped me is from Canada.",
    options: ["which", "where", "who", "when"],
    answer: 2,
    explanation: "先行词 teacher 指人，关系词在从句中作主语，用 who。"
  },
  {
    id: "g9-conditionals",
    grade: "grade9",
    category: "复合句",
    title: "条件句：if 与 unless",
    summary: "真实条件句表达有可能发生的条件和结果。unless 等于 if ... not，让条件表达更简洁。",
    formula: "If + present, will-can-may + base verb; unless + affirmative clause",
    examples: [
      { en: "If you ask clearly, people will understand.", zh: "如果你问得清楚，人们就会明白。" },
      { en: "We won't leave unless the rain stops.", zh: "除非雨停，否则我们不会离开。" }
    ],
    pitfall: "表示将来结果时，if/unless 从句通常不用 will，而用一般现在时。",
    question: "Unless you ____ now, you will miss the bus.",
    options: ["leave", "will leave", "left", "are leaving yesterday"],
    answer: 0,
    explanation: "unless 引导的条件从句用一般现在时表示将来。"
  },
  {
    id: "g9-reported-speech",
    grade: "grade9",
    category: "交流表达",
    title: "直接引语与间接引语",
    summary: "间接引语转述别人说过的话。主句为过去时，转述内容的时态、代词和时间词通常要根据说话视角作相应变化。",
    formula: "said (that) + clause / told somebody (that) + clause",
    examples: [
      { en: "Lily said, 'I am tired.'", zh: "莉莉说：“我累了。”" },
      { en: "Lily said that she was tired.", zh: "莉莉说她累了。" }
    ],
    pitfall: "say 后不能直接接人；tell 后通常要接人，如 told me。客观真理转述时可保持一般现在时。",
    question: "Ben said that he ____ busy then.",
    options: ["is", "was", "will be", "has"],
    answer: 1,
    explanation: "主句 said 是过去时，转述当时的状态通常用 was。"
  },
  {
    id: "g9-indirect-questions",
    grade: "grade9",
    category: "交流表达",
    title: "间接疑问与疑问词 + to do",
    summary: "间接疑问让提问更自然、更礼貌，也可以把“该做什么、怎样做”压缩为疑问词 + 不定式。",
    formula: "Could you tell me + WH-clause? / WH-word + to do",
    examples: [
      { en: "I wonder whether she will join us.", zh: "我想知道她是否会加入我们。" },
      { en: "He showed me how to use the camera.", zh: "他教我怎样使用相机。" }
    ],
    pitfall: "间接疑问后用陈述语序；whether 比 if 更适合与 or not 或不定式连用。",
    question: "I don't know what ____ next.",
    options: ["do", "to do", "doing", "did"],
    answer: 1,
    explanation: "“疑问词 + to do”可以表达“该做什么”。"
  },
  {
    id: "g9-sentence-patterns",
    grade: "grade9",
    category: "句子结构",
    title: "英语基本句型",
    summary: "复杂句也由几个基本骨架生长而来：主谓、主谓宾、主系表、双宾语和宾语补足语。先看清主干，长句就不再拥挤。",
    formula: "SV / SVO / SVC / SVOO / SVOC",
    examples: [
      { en: "The news made everyone excited.", zh: "这个消息让每个人都很兴奋。（SVOC）" },
      { en: "My uncle sent me a postcard.", zh: "叔叔给我寄了一张明信片。（SVOO）" }
    ],
    pitfall: "感官和变化类系动词如 look、sound、become 后常接形容词作表语。",
    question: "Which is the complement in 'The soup tastes delicious'?",
    options: ["The soup", "tastes", "delicious", "There is none"],
    answer: 2,
    explanation: "tastes 是系动词，delicious 说明主语状态，是表语。"
  },
  {
    id: "g9-causatives",
    grade: "grade9",
    category: "非谓语动词",
    title: "使役与感官动词",
    summary: "make、let、have 等使役动词以及 see、hear、watch 等感官动词，常接宾语 + 动词原形；强调动作正在进行时可接 -ing。",
    formula: "make-let-have + object + base verb / see-hear + object + do-doing",
    examples: [
      { en: "The story made us laugh.", zh: "这个故事把我们逗笑了。" },
      { en: "I heard someone playing the piano.", zh: "我听见有人正在弹钢琴。" }
    ],
    pitfall: "主动语态中 make 后不带 to；变成被动语态时要还原 to，如 was made to wait。",
    question: "The joke made everyone ____.",
    options: ["to laugh", "laugh", "laughing to", "laughed"],
    answer: 1,
    explanation: "make + 宾语 + 动词原形，使用 laugh。"
  },
  {
    id: "g9-participles",
    grade: "grade9",
    category: "非谓语动词",
    title: "现在分词与过去分词作修饰语",
    summary: "-ing 形式常带主动或“令人……”的意味，过去分词常带被动、完成或“感到……”的意味。它们可以放在名词前后修饰名词。",
    formula: "an exciting story / excited students / the girl standing there",
    examples: [
      { en: "The students were excited by the exciting news.", zh: "学生们因这个令人兴奋的消息而激动。" },
      { en: "The photos taken yesterday are beautiful.", zh: "昨天拍的照片很美。" }
    ],
    pitfall: "人不一定总用 -ed，事物也不一定总用 -ing；关键看主动、被动和实际含义。",
    question: "We were ____ by the ____ ending.",
    options: ["surprising; surprised", "surprised; surprising", "surprise; surprised", "surprised; surprise"],
    answer: 1,
    explanation: "人感到惊讶用 surprised，结局令人惊讶用 surprising。"
  },
  {
    id: "g9-tag-questions",
    grade: "grade9",
    category: "交流表达",
    title: "反意疑问句",
    summary: "反意疑问句在陈述后加一个简短问句，用来确认信息。通常前肯后否、前否后肯，助动词和人称要与前句呼应。",
    formula: "positive statement, negative tag? / negative statement, positive tag?",
    examples: [
      { en: "You have finished, haven't you?", zh: "你已经完成了，对吗？" },
      { en: "She isn't coming, is she?", zh: "她不来了，是吗？" }
    ],
    pitfall: "never、hardly、few、little 等含否定意义，后面的附加问句通常用肯定形式。",
    question: "Tom seldom eats fast food, ____?",
    options: ["does he", "doesn't he", "is he", "isn't he"],
    answer: 0,
    explanation: "seldom 含否定意义，主句是实义动词一般现在时，附加问句用 does he。"
  },
  {
    id: "g9-result-structures",
    grade: "grade9",
    category: "句子结构",
    title: "too、enough、so 与 such",
    summary: "这些结构表达程度与结果。too ... to 带有“太……而不能”，enough to 表示程度足够；so 修饰形容词副词，such 修饰名词短语。",
    formula: "too ... to / adj-adv enough to / so + adj + that / such + noun + that",
    examples: [
      { en: "The box is too heavy for me to carry.", zh: "箱子太重，我搬不动。" },
      { en: "It was such a clear night that we saw every star.", zh: "夜空如此晴朗，我们看见了每颗星星。" }
    ],
    pitfall: "enough 修饰形容词时放在形容词后；修饰名词时通常放在名词前。",
    question: "The room is large enough ____ thirty students.",
    options: ["hold", "holding", "to hold", "held"],
    answer: 2,
    explanation: "形容词 + enough + to do 表示“足够……可以做”。"
  },
  {
    id: "g9-modal-deduction",
    grade: "grade9",
    category: "情态与态度",
    title: "情态动词表示推测",
    summary: "must 表示有充分根据的肯定推测，may/might/could 表示可能，can't 表示有充分根据的否定推测。",
    formula: "must be / may-might-could be / can't be",
    examples: [
      { en: "The lights are on. Someone must be home.", zh: "灯亮着，家里一定有人。" },
      { en: "That can't be Leo; he is abroad.", zh: "那不可能是利奥，他在国外。" }
    ],
    pitfall: "mustn't 表示“禁止”，不是“不可能”；表示否定推测要用 can't。",
    question: "This ____ be Mia's coat. Hers is blue, but this one is red.",
    options: ["must", "can't", "should", "has to"],
    answer: 1,
    explanation: "颜色与已知信息不符，表示“不可能”用 can't。"
  },
  {
    id: "g9-subject-verb",
    grade: "grade9",
    category: "句子结构",
    title: "主谓一致",
    summary: "谓语动词要与真正的主语在人称和数上保持一致。插入语、介词短语或较长修饰语不会改变主语的单复数。",
    formula: "singular subject + singular verb / plural subject + plural verb",
    examples: [
      { en: "The list of names is on the desk.", zh: "名单在桌上。" },
      { en: "Neither answer is correct.", zh: "两个答案都不正确。" }
    ],
    pitfall: "each、every、either、neither 作主语时通常看作单数；there be 要看后面的实际主语。",
    question: "Each of the students ____ a reading journal.",
    options: ["have", "has", "are having", "were"],
    answer: 1,
    explanation: "each 作主语时按单数处理，使用 has。"
  },
  {
    id: "g9-exclamations",
    grade: "grade9",
    category: "交流表达",
    title: "感叹句",
    summary: "What 引导的感叹句中心是名词，How 引导的感叹句中心是形容词或副词。感叹句让语气有温度，但结构仍然清晰。",
    formula: "What (a-an) + adj + noun! / How + adj-adv + subject + verb!",
    examples: [
      { en: "What a thoughtful idea it is!", zh: "这是一个多么周到的想法啊！" },
      { en: "How beautifully she sings!", zh: "她唱得多么动听啊！" }
    ],
    pitfall: "可数名词单数前不要漏掉 a/an；How 后直接接形容词或副词。",
    question: "____ useful advice you have given me!",
    options: ["What", "What a", "How", "How a"],
    answer: 0,
    explanation: "advice 是不可数名词，使用 What + 形容词 + 不可数名词。"
  }
];
