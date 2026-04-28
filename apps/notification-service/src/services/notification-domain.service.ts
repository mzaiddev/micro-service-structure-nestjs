import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateNotificationCommandDto } from '../dto/create-notification-command.dto';
import { Notification, NotificationDocument } from '../schemas/notification.schema';

@Injectable()
export class NotificationDomainService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(dto: CreateNotificationCommandDto) {
    const created = new this.notificationModel(dto);
    return created.save();
  }

  async listByUser(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).limit(100).lean();
  }
}
