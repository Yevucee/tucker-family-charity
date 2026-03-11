import { useEffect } from "react";

type InstagramEmbedProps = {
  elfsightAppId: string;
  widgetUrl: string;
};

export function InstagramEmbed({ elfsightAppId, widgetUrl }: InstagramEmbedProps) {
  if (elfsightAppId) {
    return <ElfsightEmbed appId={elfsightAppId} />;
  }

  if (widgetUrl) {
    return (
      <iframe
        src={widgetUrl}
        title="Instagram feed"
        className="w-full border-0 rounded-lg overflow-hidden"
        style={{ minHeight: "400px" }}
      />
    );
  }

  return null;
}

function ElfsightEmbed({ appId }: { appId: string }) {
  useEffect(() => {
    if (!appId) return;

    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [appId]);

  return (
    <div
      className={`elfsight-app-${appId}`}
      data-elfsight-app-lazy
      style={{ minHeight: "400px" }}
    />
  );
}
