import KeyForm from './KeyForm';

const AddKey = () => {
  return (
    <section className="grid items-center justify-center text-center">
      <h2 className="text-headline-small mb-8">Setup API Connection</h2>
      <p className="max-w-sm text-center">
        For using portfolio features, setup your API Key & Secret. Follow these instructions to generate an API Key and
        Secret.
      </p>

      <p className="text-xs text-red-500">Only enable Reading!</p>

      <div className="mt-8">
        <KeyForm />
      </div>
    </section>
  );
};

export default AddKey;
