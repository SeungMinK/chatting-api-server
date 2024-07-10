import { ApiProperty } from "@nestjs/swagger";

export class AuthLoginResponseDto {
  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyMSIsImlkIjoiMSIsImlhdCI6MTcyMDYxNzIyMywiZXhwIjoxNzIwNjE3MjgzfQ.wkU_hj0jZyysvtJO3c-egG4rkm6IozCHiUuLwdUp8SI",
  })
  access_token: string;
}
