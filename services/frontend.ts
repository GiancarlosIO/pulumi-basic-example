
import * as pulumi from "@pulumi/pulumi";
import { FmBucket } from '../resources/bucket'

type TFmFrontendArgs = {
  Product: string;
  Name: string;
}

export class FmFrontend extends pulumi.ComponentResource {
  constructor(args: TFmFrontendArgs, opts?: pulumi.CustomResourceOptions) {
    const resourceName = `${args.Product}-${args.Name}`;

    super("pkg:index:FmFrontend", resourceName, {}, opts);

    new FmBucket({
      Name: args.Name,
      Product: args.Product,
      Public: true, // deliberate decision
    }, {
      parent: this
    })

    new FmBucket({
      Name: `${args.Name}-replica`,
      Product: args.Product,
    }, {
      parent: this
    })
  }
}
