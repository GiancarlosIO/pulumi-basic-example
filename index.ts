import "dotenv";

import { FmBucket } from "./resources/bucket";
import { FmFrontend } from './services/frontend'

async function main() {
  new FmFrontend({
    Name: 'fm-example1',
    Product: 'pulumi'
  })
}

main()


