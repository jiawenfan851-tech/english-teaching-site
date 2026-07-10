window.STAGE_KNOWLEDGE_DATA = [
  {
    id: "p-phonics", stage: "primary", grade: "primary-lower", category: "语音启蒙", title: "字母音与自然拼读",
    summary: "先听见字母在单词里的常见发音，再把声音连起来读出短词。拼读关注的是声音，而不只是字母名称。",
    formula: "c-a-t → /k/ + /æ/ + /t/ → cat",
    examples: [{ en: "map, bag, hand", zh: "字母 a 在这些闭音节词中常读 /æ/。" }, { en: "sit, fish, milk", zh: "字母 i 在这些词中常读 /ɪ/。" }],
    pitfall: "同一个字母可能有多种发音，先掌握最常见的规律，再结合具体单词记忆。",
    question: "Which word has the same vowel sound as cat?", options: ["cake", "bag", "car", "call"], answer: 1,
    explanation: "bag 和 cat 中的字母 a 都读短音 /æ/。"
  },
  {
    id: "p-be", stage: "primary", grade: "primary-lower", category: "基础句型", title: "am、is 与 are",
    summary: "be 动词用来连接人物与身份、状态或位置。它会根据主语发生变化。",
    formula: "I am / He, She, It is / You, We, They are",
    examples: [{ en: "I am happy.", zh: "我很开心。" }, { en: "They are in the classroom.", zh: "他们在教室里。" }],
    pitfall: "I 后面用 am；复数人物或事物通常用 are。",
    question: "My books ____ on the desk.", options: ["am", "is", "are", "be"], answer: 2,
    explanation: "books 是复数，所以使用 are。"
  },
  {
    id: "p-plurals", stage: "primary", grade: "primary-upper", category: "词语变化", title: "名词单数与复数",
    summary: "说一个事物时用单数，说两个或更多时通常使用复数形式。多数名词在词尾加 -s 或 -es。",
    formula: "book → books / box → boxes / child → children",
    examples: [{ en: "There are three apples.", zh: "有三个苹果。" }, { en: "Two children are reading.", zh: "两个孩子正在读书。" }],
    pitfall: "child、foot、tooth 等词有不规则复数，需要单独记忆。",
    question: "Which plural form is correct?", options: ["boxs", "boxies", "boxes", "box"], answer: 2,
    explanation: "以 x 结尾的名词通常加 -es，box 的复数是 boxes。"
  },
  {
    id: "p-present", stage: "primary", grade: "primary-upper", category: "日常表达", title: "一般现在时",
    summary: "一般现在时用来表达习惯、经常发生的事情和事实。he、she、it 后面的动词通常加 -s。",
    formula: "I play / She plays / Do you play? / He does not play.",
    examples: [{ en: "We walk to school every day.", zh: "我们每天步行上学。" }, { en: "Leo likes science.", zh: "利奥喜欢科学。" }],
    pitfall: "句子中有 does 或 doesn't 时，后面的实义动词要使用原形。",
    question: "Does Amy ____ English after class?", options: ["reads", "read", "reading", "to read"], answer: 1,
    explanation: "助动词 does 后面使用动词原形 read。"
  },
  {
    id: "p-can", stage: "primary", grade: "primary-upper", category: "日常表达", title: "用 can 表达能力",
    summary: "can 可以表达会做某事，也可以用来提出请求。can 后面直接接动词原形。",
    formula: "subject + can / cannot + verb",
    examples: [{ en: "I can swim.", zh: "我会游泳。" }, { en: "Can you help me?", zh: "你能帮我吗？" }],
    pitfall: "can 后面的动词不加 -s，也不加 to。",
    question: "She can ____ very well.", options: ["sings", "sing", "to sing", "singing"], answer: 1,
    explanation: "can 后面使用动词原形 sing。"
  },
  {
    id: "p-reading", stage: "primary", grade: "primary-upper", category: "阅读启蒙", title: "读懂人物、时间和地点",
    summary: "短文中的人物、时间和地点是理解故事的三个入口。先圈出这些信息，再梳理发生了什么。",
    formula: "Who? + When? + Where? + What happened?",
    examples: [{ en: "Tom visits the zoo on Sunday.", zh: "人物 Tom；时间 Sunday；地点 zoo。" }, { en: "Mia reads in the library after school.", zh: "人物 Mia；时间 after school；地点 library。" }],
    pitfall: "不要只寻找和问题完全相同的词，也要注意代词和近义表达。",
    question: "In 'Lily plays chess at home after dinner', where is Lily?", options: ["At school", "At home", "In a park", "At a shop"], answer: 1,
    explanation: "句中的地点信息是 at home。"
  },
  {
    id: "h-sentence", stage: "high", grade: "high1", category: "句法基础", title: "拆解长句主干",
    summary: "先找到谓语动词，再确认主语和宾语；修饰语、从句和插入语可以暂时放到一边。主干清楚后再逐层补回信息。",
    formula: "主语 + 谓语 + 宾语 / 表语 + 修饰成分",
    examples: [{ en: "The habit of reading widely improves our ability to think.", zh: "主干：The habit improves our ability。" }, { en: "Students who ask questions often learn more deeply.", zh: "主干：Students learn more deeply。" }],
    pitfall: "介词短语里的名词不一定是主语，定语从句里的动词也不一定是主句谓语。",
    question: "What is the main verb in 'The books on the desk belong to Anna'?", options: ["books", "desk", "belong", "Anna"], answer: 2,
    explanation: "on the desk 是修饰 books 的介词短语，主句谓语是 belong。"
  },
  {
    id: "h-nonfinite", stage: "high", grade: "high1", category: "句法基础", title: "非谓语动词",
    summary: "to do、doing 和 done 能在句中承担不同成分。判断时先确认句中是否已有谓语，再看动作的主动、被动和时间关系。",
    formula: "to do（目的/将来）/ doing（主动/进行）/ done（被动/完成）",
    examples: [{ en: "To improve your writing, read every day.", zh: "to improve 表示目的。" }, { en: "Inspired by the speech, she took action.", zh: "inspired 表示被动。" }],
    pitfall: "不能只凭固定搭配选择形式，还要看逻辑主语与动作之间的关系。",
    question: "____ by the view, we stopped to take photos.", options: ["Amazed", "Amazing", "To amaze", "Amaze"], answer: 0,
    explanation: "we 与 amaze 是被动关系，因此使用过去分词 Amazed。"
  },
  {
    id: "h-relative", stage: "high", grade: "high2", category: "复合句", title: "定语从句",
    summary: "定语从句紧跟在先行词后，对人或事物进行补充说明。关系词既连接句子，也在从句中承担成分。",
    formula: "先行词 + who / which / that / whose / where + 从句",
    examples: [{ en: "The teacher who encouraged me changed my life.", zh: "who 指代 teacher 并在从句中作主语。" }, { en: "This is the place where we first met.", zh: "where 在从句中作地点状语。" }],
    pitfall: "选择关系词前，既要看先行词，也要判断从句缺少什么成分。",
    question: "The book ____ cover is blue is mine.", options: ["who", "which", "whose", "where"], answer: 2,
    explanation: "cover 与 book 是所属关系，因此使用 whose。"
  },
  {
    id: "h-clauses", stage: "high", grade: "high2", category: "复合句", title: "名词性从句",
    summary: "名词性从句可以在句中作主语、宾语、表语或同位语。连接词要根据从句意义和缺少的成分选择。",
    formula: "that / whether / what / why / how + 陈述语序",
    examples: [{ en: "What matters is how you respond.", zh: "what 引导主语从句，how 引导表语从句。" }, { en: "I wonder whether the plan will work.", zh: "whether 引导宾语从句。" }],
    pitfall: "名词性从句通常使用陈述语序，不使用一般疑问句语序。",
    question: "Do you know ____ he solved the problem?", options: ["what", "how", "which", "whose"], answer: 1,
    explanation: "句子询问解决问题的方式，因此使用 how。"
  },
  {
    id: "h-reading", stage: "high", grade: "high2", category: "阅读策略", title: "主旨与段落功能",
    summary: "主旨不是所有细节的简单相加，而是作者围绕核心对象表达的主要观点。注意首尾句、转折词和反复出现的概念。",
    formula: "主题对象 + 作者核心观点 + 文章展开方式",
    examples: [{ en: "However, the long-term benefits outweigh the cost.", zh: "however 后往往出现作者真正强调的观点。" }, { en: "For example ...", zh: "例子通常服务于前面的观点，而不是文章主旨本身。" }],
    pitfall: "范围过窄的细节和范围过大的常识都不适合作为主旨。",
    question: "Which clue most often signals a change in the writer's direction?", options: ["For example", "However", "In addition", "Similarly"], answer: 1,
    explanation: "However 表示转折，常提示作者论述方向或重点发生变化。"
  },
  {
    id: "h-cloze", stage: "high", grade: "high3", category: "语篇理解", title: "完形填空的上下文线索",
    summary: "完形填空先看语篇逻辑，再看词义和搭配。代词指代、情感变化、同义复现与转折关系都是重要线索。",
    formula: "语篇逻辑 → 句间关系 → 词义辨析 → 搭配检查",
    examples: [{ en: "Although he was tired, he continued.", zh: "although 提示前后为让步关系。" }, { en: "She smiled. This response encouraged us.", zh: "this response 指代前面的动作。" }],
    pitfall: "不要只凭空格前后两个词作答，至少阅读完整句和相邻句。",
    question: "Which word best shows a cause-and-effect relationship?", options: ["Meanwhile", "Therefore", "Instead", "Otherwise"], answer: 1,
    explanation: "Therefore 表示“因此”，明确连接原因与结果。"
  },
  {
    id: "h-writing", stage: "high", grade: "high3", category: "写作表达", title: "段落的主题句与展开",
    summary: "清楚的段落通常围绕一个中心展开。主题句提出观点，支持句用理由、例子或对比发展观点，结尾句完成收束。",
    formula: "Topic sentence + evidence / example + explanation + closing",
    examples: [{ en: "Reading daily is one of the most effective ways to build vocabulary.", zh: "主题句明确提出段落中心。" }, { en: "For instance, short articles expose learners to words in context.", zh: "例子为观点提供支持。" }],
    pitfall: "连接词不能代替真实逻辑；每个支持句都应回答“为什么”或“如何证明”。",
    question: "What should a supporting sentence do?", options: ["Introduce an unrelated idea", "Develop the central point", "Repeat the title only", "End every essay"], answer: 1,
    explanation: "支持句应通过理由、证据或例子展开段落中心。"
  },
  {
    id: "h-continuation", stage: "high", grade: "high3", category: "写作表达", title: "读后续写的情节推进",
    summary: "续写要延续原文人物、冲突和语言风格。每一段都需要明确的行动变化，并让人物动机推动情节。",
    formula: "原文线索 + 人物目标 + 阻碍与行动 + 合理结果",
    examples: [{ en: "Remembering her promise, Mia turned back.", zh: "用原文承诺解释人物行动。" }, { en: "Only then did he realize what the note meant.", zh: "通过认知变化推动情节。" }],
    pitfall: "避免突然增加无关人物、超自然转折或无法从原文推导的结局。",
    question: "Which choice makes a continuation most coherent?", options: ["Ignoring all earlier clues", "Following the character's established goal", "Changing the setting without reason", "Adding a new conflict at the final sentence"], answer: 1,
    explanation: "延续人物已经建立的目标，能让行动与原文保持连贯。"
  }
];
