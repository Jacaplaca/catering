import Breadcrumbs from '@root/app/_components/Breadcrumbs';
import { humanize } from '@root/app/lib/textConverter';
import { type FunctionComponent } from 'react';

const PageHeader: FunctionComponent<{
  title: string;
  showBreadcrumb?: boolean;
}> = ({ title, showBreadcrumb }) => {
  return (
    <section>
      <h1 className="text-4xl font-bold"
      >{humanize(title)}</h1>
      {showBreadcrumb ? <Breadcrumbs className="mt-4" /> : null}
    </section>
  );
};

export default PageHeader;
