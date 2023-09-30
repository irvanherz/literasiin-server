import { Body, Controller, Post } from '@nestjs/common';
import { FixGrammarDto } from './dto/robots.dto';
import { RobotsService } from './robots.service';

@Controller('robots')
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) {}

  @Post('autofix')
  async fixGrammar(@Body() payload: FixGrammarDto) {
    const response = await this.robotsService.fixGrammar(payload);
    return { data: response.choices[0].message.content };
  }

  @Post('paraphrase')
  async paraphrase(@Body() payload: FixGrammarDto) {
    const response = await this.robotsService.paraphrase(payload);
    return { data: response.choices[0].message.content };
  }

  @Post('story-idea')
  async storyIdea(@Body() payload: FixGrammarDto) {
    const response = await this.robotsService.storyIdea(payload);
    const data = JSON.parse(response.choices[0].message.content);
    return { data: data };
  }
}
