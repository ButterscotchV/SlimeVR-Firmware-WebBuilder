import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum BatteryType {
  BAT_EXTERNAL = "BAT_EXTERNAL",
  BAT_INTERNAL = "BAT_INTERNAL",
  BAT_MCP3021 = "BAT_MCP3021",
  BAT_INTERNAL_MCP3021 = "BAT_INTERNAL_MCP3021",
}

export class BatteryDTO {
  @ApiProperty({ enum: BatteryType })
  @IsEnum(BatteryType)
  public type: BatteryType;

  @ApiProperty({ default: 180 })
  public resistance: number;

  @ApiProperty({ default: 100 })
  public r1: number;

  @ApiProperty({ default: 220 })
  public r2: number;

  @ApiProperty()
  public pin: string;
}
