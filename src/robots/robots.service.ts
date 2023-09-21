import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { FixGrammarDto } from './dto/robots.dto';

// type Result = {
//   title: string; //judul cerita
//   description: string; //sinopsis cerita
//   chapters: [
//     {
//       title: string; //judul bab cerita
//       outlines: string[]; //daftar outline
//     },
//   ];
// };

@Injectable()
export class RobotsService {
  private readonly openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: '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',
    });
  }

  async fixGrammar(payload: FixGrammarDto) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Kamu akan diberikan teks, dan tugasmu adalah memperbaiki teks tersebut agar memiliki tata penulisan bahasa indonesia yang benar.',
        },
        {
          role: 'user',
          content: payload.text,
        },
      ],
      temperature: 0,
      max_tokens: 500,
    });
    return response;
  }

  async paraphrase(payload: FixGrammarDto) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Kamu akan diberikan teks, dan tugasmu adalah melakukan parafrase teks tersebut sehingga memiliki kesan yang berbeda saat dibaca',
        },
        {
          role: 'user',
          content: payload.text,
        },
      ],
      temperature: 0,
      max_tokens: 500,
    });
    return response;
  }

  async storyIdea(payload: FixGrammarDto) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Kamu akan diberikan teks berisi tema sebuah cerita, dan tugasmu adalah melakukan membuatkan ide cerita. Ide cerita tersebut meliputi judul, sinopsis dan outline cerita.\nHasilkan dalam bentuk JSON dengan definise tipe berikut:\ntype Result = {\r\n  title: string; //judul cerita\r\n  description: string; //sinopsis cerita\r\n  chapters: [\r\n    {\r\n      title: string; //judul bab cerita\r\n      outlines: string[]; //daftar outline\r\n    },\r\n  ];\r\n}',
        },
        {
          role: 'user',
          content: payload.text,
        },
      ],
      temperature: 0,
      max_tokens: 2000,
    });
    return response;
  }
}
