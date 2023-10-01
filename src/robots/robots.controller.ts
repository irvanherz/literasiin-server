import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { BuildStoryDto, FixGrammarDto } from './dto/robots.dto';
import { RobotsService } from './robots.service';

@Controller('robots')
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('autofix')
  async fixGrammar(@Body() payload: FixGrammarDto) {
    const response = await this.robotsService.fixGrammar(payload);
    return { data: response.choices[0].message.content };
  }

  @UseGuards(JwtAuthGuard)
  @Post('paraphrase')
  async paraphrase(@Body() payload: FixGrammarDto) {
    const response = await this.robotsService.paraphrase(payload);
    return { data: response.choices[0].message.content };
  }

  @UseGuards(JwtAuthGuard)
  @Post('story-idea')
  async storyIdea(@Body() payload: FixGrammarDto) {
    const response = await this.robotsService.storyIdea(payload);
    const data = JSON.parse(response.choices[0].message.content);
    return { data: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('build-story')
  async buildStory(@Body() payload: BuildStoryDto, @User() currentUser) {
    const result = await this.robotsService.buildStory(currentUser.id, payload);
    return { data: result };
  }
}
