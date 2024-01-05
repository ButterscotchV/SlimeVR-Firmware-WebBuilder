import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { BatteryDTO, BatteryType } from './battery.dto';
import { FirmwareBoardDTO } from './firmware-board.dto';
import { IMUConfigDTO } from './imu.dto';
import { BOARD_DEFAULTS } from '../firmware.constants';

export class BuildFirmwareDTO {
  @ApiProperty()
  public version: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => FirmwareBoardDTO)
  public board: FirmwareBoardDTO;

  @ApiProperty({ type: [IMUConfigDTO] })
  @ValidateNested({ each: true })
  @Type(() => IMUConfigDTO)
  public imus: IMUConfigDTO[];

  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => BatteryDTO)
  @IsOptional()
  public battery?: BatteryDTO;

  @ApiProperty({ required: false })
  @IsOptional()
  public swapAddresses?: boolean;

  static completeDefaults(dto: BuildFirmwareDTO): BuildFirmwareDTO {
    const boardDefaults = BOARD_DEFAULTS[dto.board.type];

    const defaultInts = [
      boardDefaults['PIN_IMU_INT'],
      boardDefaults['PIN_IMU_INT_2'],
    ];
    dto.imus = dto.imus.map((imu, index) => ({
      ...imu,
      imuINT: imu.imuINT || defaultInts[index] || '255',
    }));

    if (!dto.board.pins) {
      dto.board.pins = {
        imuSDA: boardDefaults['PIN_IMU_SDA'],
        imuSCL: boardDefaults['PIN_IMU_SCL'],
        led: boardDefaults['LED_PIN'] || '2',
      };
    }

    if (!dto.battery) {
      dto.battery = new BatteryDTO();
      dto.battery.type = BatteryType.BAT_EXTERNAL;
      dto.battery.resistance =
        boardDefaults['BATTERY_SHIELD_RESISTANCE'] ?? 180;
      dto.battery.r1 = boardDefaults['BATTERY_SHIELD_R1'] ?? 100;
      dto.battery.r2 = boardDefaults['BATTERY_SHIELD_R2'] ?? 220;
    }

    if (!dto.battery.pin) {
      dto.battery.pin = boardDefaults['PIN_BATTERY_LEVEL'];
    }

    if (dto.board.ledInverted === undefined) {
      dto.board.ledInverted = boardDefaults['LED_INVERTED'] ?? true;
    }

    if (dto.board.enableLed === undefined) {
      dto.board.enableLed = !['LED_OFF', '255'].includes(
        boardDefaults['LED_PIN'],
      );
    }

    if (dto.swapAddresses === undefined) {
      dto.swapAddresses = false;
    }

    return dto;
  }
}
