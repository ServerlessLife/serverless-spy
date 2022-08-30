import { StackProps } from 'aws-cdk-lib';

export interface GenerateSpyEventsFileProps extends StackProps {
  readonly generateSpyEventsFile: boolean;
}
