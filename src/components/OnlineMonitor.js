import { useGlobal } from "reactn";

function OnlineMonitor(props) {
  const [isOnline, setIsOnline] = useGlobal("isOnline");

  let timer = null;

  useEffect(() => {
    componentMount();
    return () => {
      clearInterval(timer);
    };
  }, []);

  const componentMount = () => {
    timer = setInterval(checkOnline, 2000);
  };

  const checkOnline = e => {
    if (navigator.onLine !== isOnline) {
      setIsOnline(navigator.onLine);
    }
  };

  return null;
}

export default OnlineMonitor;
