import {LocalDate, LocalTime} from '@js-joda/core';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import {UserEntity} from '../../../user/entity/user.entity';
import {DateTransformer, TimeTransformer} from '../../../utils/datetime';
import {RestaurantEntity} from '../../entity/restaurant.entity';

@Entity({name: 'vote_entry', schema: 'public'})
@Unique(['user', 'date'])
export class VoteEntryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {name: 'id'})
  id: string;

  @Column({
    type: 'date',
    name: 'date',
    transformer: new DateTransformer(),
    default: LocalDate.now(),
  })
  date: LocalDate;

  @Column({
    type: 'time',
    name: 'time',
    transformer: new TimeTransformer(),
    default: LocalTime.now(),
  })
  time: LocalTime;

  @ManyToOne(() => UserEntity, {eager: false})
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  user: UserEntity;

  @ManyToOne(() => RestaurantEntity, {eager: false})
  @JoinColumn({name: 'restaurant_id', referencedColumnName: 'id'})
  restaurant: RestaurantEntity;
}
