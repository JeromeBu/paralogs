export abstract class Entity<Props extends { uuid: string }> {
  private id: number | undefined;

  protected constructor(protected props: Props) {}

  get uuid(): Props["uuid"] {
    return this.props.uuid;
  }

  public setIdentity(id: number | undefined): void {
    this.id = id;
  }

  public hasIdentity(): boolean {
    return this.id !== undefined;
  }

  public getIdentity(): number | undefined {
    return this.id;
  }

  public getProps(): Props {
    return this.props;
  }
}
