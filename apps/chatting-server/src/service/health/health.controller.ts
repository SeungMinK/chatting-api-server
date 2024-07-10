import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@ApiTags("health")
@Controller()
export class HealthController {
  constructor() {}

  @Get("/health")
  @ApiOkResponse({ description: "Returned if it is reachable." })
  @ApiOperation({
    description:
      "Simple health check to check if an instance is reachable on the network.",
  })
  async check(@Res() res: Response) {
    res.status(HttpStatus.OK).send("OK");
  }
}
