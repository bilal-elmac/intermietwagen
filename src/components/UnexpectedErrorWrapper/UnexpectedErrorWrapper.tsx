import { ErrorInfo, Component, ReactNode } from 'react';

import { RVError, RVErrorType, isRVError } from '../../domain/Error';

import { Services } from '../../services';

type WithRender = {
    readonly render: (error: RVError | null, clearError: () => void) => ReactNode;
};
type WithChildren = {
    readonly fallback: (clearError: () => void) => ReactNode;
    readonly children: JSX.Element | JSX.Element[];
};
type Props = (WithRender | WithChildren) & { readonly boundaryName?: string } & Pick<Services, 'loggerService'>;

type State = { error: RVError | null };

export class UnexpectedErrorWrapper extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { error: null };
    }

    private mapError(error: unknown, { componentStack }: ErrorInfo): RVError {
        if (isRVError(error)) {
            return error;
        }

        if (error instanceof Error) {
            return new RVError(RVErrorType.UNEXPECTED_STATE, error.message, {
                stack: error.stack,
                name: error.name,
                componentStack,
                boundaryName: this.props.boundaryName,
            });
        }

        return new RVError(RVErrorType.UNEXPECTED_STATE, String(error), {
            ...(error as object),
            componentStack,
            boundaryName: this.props.boundaryName,
        });
    }

    componentDidCatch(error: unknown, info: ErrorInfo): void {
        const wrappedError = this.mapError(error, info);
        this.props.loggerService.error(wrappedError);
        this.setState({ error: wrappedError });
    }

    render(): JSX.Element | JSX.Element[] | ReactNode {
        if ('render' in this.props) {
            return this.props.render(this.state.error, () => this.setState({ error: null }));
        }

        if (this.state.error) {
            return this.props.fallback(() => this.setState({ error: null }));
        }

        return this.props.children;
    }
}
