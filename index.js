#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 打开qq音乐网页端，获取lyric的base64编码，然后进行处理
rl.question('请输入Base64编码: ', (base64Text) => {
  try {
    // 将Base64编码解码为普通文本
    const plainText = Buffer.from(base64Text, 'base64');

    // 将普通文本通过decodeURIComponent解码为UTF-8格式文本
    const decodedText = decodeURIComponent(plainText);

    // 拼接chatgpt的prompt和歌词，让chatgpt优化lrc文件
    const formattedText = `
###任务
请帮我将下面的滚动歌词格式化

###要求
1、时序的小数点最后为两位长度，长度超过两位的直接舍弃，不够两位的进行补0
2、将明显插入的广告给过滤掉，比如“欢迎访问xxx.com网”
3、将每个时序后的歌词中的非有效的、明显无意义的空格过滤掉，比如“他 是 我 最 爱 的人”
4、繁体字改为简体字

###歌词
${decodedText}
    `;

    // 将解码结果保存到output.txt文件中
    fs.writeFileSync('output.txt', formattedText, 'utf-8');

    console.log('解码结果已保存到output.txt文件。');
  } catch (error) {
    console.error('解码失败:', error.message);
  }

  rl.close();
});
