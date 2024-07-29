import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";


type TFmBucketArgs = {
  Name: string;
  // Service: string; 
  Product: string;
  Public?: boolean;
}

export class FmBucket extends pulumi.ComponentResource {
  constructor(args: TFmBucketArgs, opts?: pulumi.CustomResourceOptions) {
    const resourceName = `${args.Product}-${args.Name}`;

    super("pkg:index:FmBucket", resourceName, {}, opts)

    const stack = pulumi.getStack();
    const bucketName = `${resourceName}-${stack}`

    let bucketArgs: aws.s3.BucketArgs = {
      acl: 'private',
      bucket: bucketName,
      tags: {
        Environment: stack,
        Name: bucketName
      },
    }

    if (args.Public) {
      bucketArgs.acl = 'public-read';
      bucketArgs.website = {
        indexDocument: 'index.html',
        errorDocument: 'error.html',
        routingRules: `[{
"Condition": {
  "KeyPrefixEquals": "docs/"
},
"Redirect": {
  "ReplaceKeyPrefixWith": "documents/*"
}
}]`
      };
    }

    // the args.name param defines the name of the bucket (arn?)
    const bucket = new aws.s3.Bucket(args.Name, bucketArgs, {
      parent: this,
    })

    if (!args.Public) {
      new aws.s3.BucketPublicAccessBlock(args.Name, {
        bucket: bucket.id,
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true
      }, {
        parent: this
      })
    }

  }
}

