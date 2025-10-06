import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IContentfulItemResponse } from "../product/dto/contentful.response";

@Entity()
export class Content {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    contentId: string;

    @Column({nullable: true})
    sku?: string;

    @Column({nullable: true})
    name?: string;

    @Column({nullable: true})
    brand?: string;

    @Column({nullable: true})
    model?: string;

    @Column({nullable: true})
    category?: string;

    @Column({nullable: true})
    color?: string;

    @Column({
        type: 'decimal',
        nullable: true,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    price?: number;

    @Column({nullable: true})
    currency?: string;
    
    @Column({nullable: true})
    stock?: number;

    @Column()
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    public static create(data: IContentfulItemResponse): Content {
        const content = new Content();
        content.contentId = data?.sys?.id;
        content.sku = data?.fields?.sku;
        content.name = data?.fields?.name;
        content.brand = data?.fields?.brand;
        content.model = data?.fields?.model;
        content.category = data?.fields?.category;
        content.color = data?.fields?.color;
        content.price = data?.fields?.price;
        content.currency = data?.fields?.currency;
        content.stock = data?.fields?.stock;
        content.active = true;

        return content;
    }
}