# 数据来源与署名(Credits)

## 教材句库(src/content/corpus.json)

- **来源:[Tatoeba](https://tatoeba.org) 开源平行语料库**(example sentences & translations export)
- **许可:[CC BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/deed.en)** —— 本应用按协议要求注明出处与许可;感谢 Tatoeba 社区贡献的 67 万+ 英中对照句对
- 处理方式:见 `scripts/build-corpus.mjs` —— 清洗过滤(长度/标点/繁简)、按 Google 10k 词频表分四级(A2/B1/B2/C1)、按关键词标注 11 个话题、分层采样约 6,700 句

## 词频表

- [google-10000-english](https://github.com/first20hours/google-10000-english)(MIT License)—— 用于句子的难度分级

## 词汇表(src/content/vocab.json)

- **来源:[ECDICT](https://github.com/skywind3000/ECDICT)** 免费英汉词典数据(30,000 高频词:音标、中文释义、中考/高考/四六级/考研/托福/雅思/GRE/Oxford3000 考级标签)
- **许可:MIT License** —— 处理方式见 `scripts/build-vocab.mjs`(按使用频率排序取前 3 万词)

## 精选句包、场景、提示词

- 由 SpeakFlow 项目人工编写,无外部数据来源
